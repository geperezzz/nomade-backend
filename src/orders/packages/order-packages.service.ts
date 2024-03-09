import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateOrderPackageDto } from './dtos/create-order-package.dto';
import { UpdateOrderPackageDto } from './dtos/update-order-package.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderPackageEntity } from './entities/order-package.entity';
import { OrdersService } from '../orders.service';
import { PackageSnapshotsService } from 'src/packages/snapshots/package-snapshots.service';

const selectOrderPackageEntityFields = {
  select: {
    packageId: true,
    amountOrdered: true,
  },
} as const;

@Injectable()
export class OrderPackagesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private ordersService: OrdersService,
    private packageSnapshotsService: PackageSnapshotsService,
  ) {}

  @Transactional()
  async create(orderId: string, createOrderPackageDto: CreateOrderPackageDto): Promise<OrderPackageEntity> {
    const createdOrderPackage = await this.currentTransaction.orderPackage.create({
      data: {
        ...createOrderPackageDto,
        orderId,
        packageId: await this.packageSnapshotsService.pickLatestSnapshotOf(createOrderPackageDto.packageId),
      },
      ...selectOrderPackageEntityFields,
    });

    await this.ordersService.updateOrderPrice(orderId);

    return createdOrderPackage;
  }

  @Transactional()
  async findMany(
    orderId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderPackageEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.orderPackage.findMany({
      where: {
        orderId,
      },
      ...selectOrderPackageEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.orderPackage.count({
      where: {
        orderId,
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
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
  async findOne(orderId: string, packageId: string): Promise<OrderPackageEntity | null> {
    return await this.currentTransaction.orderPackage.findFirst({
      where: {
        orderId,
        package: {
          originalPackageId: packageId,
        },
      },
      ...selectOrderPackageEntityFields,
    });
  }

  @Transactional()
  async update(
    orderId: string,
    packageId: string,
    updateOrderPackageDto: UpdateOrderPackageDto,
  ): Promise<OrderPackageEntity> {
    let updatedPackageId!: string;
    if (updateOrderPackageDto.packageId) {
      updatedPackageId = await this.packageSnapshotsService.pickLatestSnapshotOf(updateOrderPackageDto.packageId);
    } else {
      updatedPackageId = packageId;
    }

    await this.currentTransaction.orderPackage.updateMany({
      where: {
        orderId,
        package: {
          originalPackageId: packageId,
        },
      },
      data: {
        ...updateOrderPackageDto,
        packageId: updatedPackageId,
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    const updatedOrderPackage = await this.findOne(orderId, updatedPackageId);
    if (!updatedOrderPackage) {
      throw new Error(
        `Order package not found: There is no Order with ID ${orderId} that has a Package with ID ${updatedPackageId}`
      );
    }
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
        package: {
          originalPackageId: packageId,
        },
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    return removedOrderPackage;
  }
}
