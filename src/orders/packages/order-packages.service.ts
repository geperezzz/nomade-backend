import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { OrderPackage as OrderPackageModel, PackageSnapshot as PackageSnapshotModel, PackageSnapshotService as PackageSnapshotServiceModel, ServiceSnapshot as ServiceSnapshotModel } from '@prisma/client';
import * as _ from 'lodash';

import { CreateOrderPackageDto } from './dtos/create-order-package.dto';
import { UpdateOrderPackageDto } from './dtos/update-order-package.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderPackageEntity } from './entities/order-package.entity';
import { OrdersService } from '../orders.service';
import { PackageSnapshotsService } from 'src/packages/snapshots/package-snapshots.service';

const selectOrderPackageEntityFields = {
  include: {
    packageSnapshot: {
      include: {
        containedServices: {
          include: {
            service: true,
          }
        },
      }
    },
  },
} as const;

type OrderPackageRawEntity = OrderPackageModel & {
  packageSnapshot: PackageSnapshotModel & {
    containedServices: (PackageSnapshotServiceModel & {
      service: ServiceSnapshotModel;
    })[];
  };
};

function rawEntityToEntity(rawOrderPackage: OrderPackageRawEntity): OrderPackageEntity {
  let orderedPackage = {
    ..._.omit(
      rawOrderPackage,
      'orderId',
      'packageSnapshotId',
      'packageSnapshot.originalPackageId'
    ),
    packageId: rawOrderPackage.packageSnapshot.originalPackageId,
  };
  
  const containedServices = orderedPackage.packageSnapshot.containedServices.map(
    containedService => ({
      serviceId: containedService.service.originalServiceId,
      serviceSnapshot: _.omit(containedService.service, 'originalServiceId'),
      amountContained: containedService.amountContained,
    })
  );
  
  return {
    ...orderedPackage,
    packageSnapshot: {
      ...orderedPackage.packageSnapshot,
      containedServices,
    }
  };
}

@Injectable()
export class OrderPackagesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    private packageSnapshotsService: PackageSnapshotsService,
  ) {}

  @Transactional()
  async create(orderId: string, createOrderPackageDto: CreateOrderPackageDto): Promise<OrderPackageEntity> {
    const [createdOrderPackage] = await this.createMany(orderId, [createOrderPackageDto]);
    return createdOrderPackage;
  }

  @Transactional()
  async createMany(orderId: string, createOrderPackageDtos: CreateOrderPackageDto[]): Promise<OrderPackageEntity[]> {
    const createdOrderPackages = await Promise.all(
      createOrderPackageDtos.map(async (createOrderPackageDto) => {
        const packageSnapshotId = createOrderPackageDto.packageSnapshot?.id
          ?? await this.packageSnapshotsService.pickLatestSnapshotOf(createOrderPackageDto.packageId);
        
        const createdOrderPackage = await this.currentTransaction.orderPackage.create({
          data: {
            amountOrdered: createOrderPackageDto.amountOrdered,
            orderId,
            packageSnapshotId,
          },
          ...selectOrderPackageEntityFields,
        });
        
        return rawEntityToEntity(createdOrderPackage);
      })
    );

    await this.ordersService.updateOrderPrice(orderId);

    return createdOrderPackages;
  }

  @Transactional()
  async findMany(
    orderId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderPackageEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawOrderPackages = await this.currentTransaction.orderPackage.findMany({
      where: {
        orderId,
      },
      ...selectOrderPackageEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    const items = rawOrderPackages.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.orderPackage.count({
      where: {
        orderId,
      },
    });

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  @Transactional()
  async findAll(orderId: string): Promise<OrderPackageEntity[]> {
    const rawOrderPackages = await this.currentTransaction.orderPackage.findMany({
      where: {
        orderId,
      },
      ...selectOrderPackageEntityFields,
    });
    return rawOrderPackages.map(rawEntityToEntity);
  }

  @Transactional()
  async findOne(orderId: string, packageId: string): Promise<OrderPackageEntity | null> {
    const rawOrderPackage = await this.currentTransaction.orderPackage.findFirst({
      where: {
        orderId,
        packageSnapshot: {
          originalPackageId: packageId,
        },
      },
      ...selectOrderPackageEntityFields,
    });
    return rawOrderPackage ? rawEntityToEntity(rawOrderPackage) : null;
  }

  @Transactional()
  async update(
    orderId: string,
    packageId: string,
    updateOrderPackageDto: UpdateOrderPackageDto,
  ): Promise<OrderPackageEntity> {
    let newPackageId = packageId;
    let newPackageSnapshotId = updateOrderPackageDto.packageSnapshot?.id;
    if (updateOrderPackageDto.packageId) {
      newPackageId = updateOrderPackageDto.packageId;
      newPackageSnapshotId ??= await this.packageSnapshotsService.pickLatestSnapshotOf(updateOrderPackageDto.packageId);
    }

    await this.currentTransaction.orderPackage.updateMany({
      where: {
        orderId,
        packageSnapshot: {
          originalPackageId: packageId,
        },
      },
      data: {
        packageSnapshotId: newPackageSnapshotId,
        amountOrdered: updateOrderPackageDto.amountOrdered,
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    const updatedOrderPackage = (await this.findOne(orderId, newPackageId)) as OrderPackageEntity;
    return updatedOrderPackage;
  }

  @Transactional()
  async remove(orderId: string, packageId: string): Promise<OrderPackageEntity> {
    const removedOrderPackage = await this.findOne(orderId, packageId);
    if (!removedOrderPackage) {
      throw new Error(
        `Order package not found: There is no Order with ID ${orderId} that has a Package with ID ${packageId}`
      );
    }
    
    await this.currentTransaction.orderPackage.deleteMany({
      where: {
        orderId,
        packageSnapshot: {
          originalPackageId: packageId,
        },
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    return removedOrderPackage;
  }
}
