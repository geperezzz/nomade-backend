import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import Decimal from 'decimal.js';

import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderEntity } from './entities/order.entity';
import { PackageSnapshotsService } from 'src/packages/snapshots/package-snapshots.service';
import { ServiceSnapshotsService } from 'src/services/snapshots/service-snapshots.service';

const selectOrderEntityFields = {
  include: {
    orderedPackages: {
      select: {
        packageId: true,
        amountOrdered: true,
      },
    },
    orderedServices: {
      select: {
        serviceId: true,
        amountOrdered: true,
      },
    },
    payments: {
      select: {
        paymentNumber: true,
        paymentTimestamp: true,
        netAmountPaid: true,
        amountWithCommissionPaid: true,
        appliedCommissionPercentage: true,
        paymentMethodId: true,
      },
    },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private packageSnapshotsService: PackageSnapshotsService,
    private serviceSnapshotsService: ServiceSnapshotsService,
  ) {}

  @Transactional()
  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const orderedPackagesAsSnapshots = await Promise.all(
      createOrderDto.orderedPackages.map(
        async ({ packageId, amountOrdered }) => ({
          packageId: await this.packageSnapshotsService.pickLatestSnapshotOf(packageId),
          amountOrdered,
        })
      )
    );

    const orderedServicesAsSnapshots = await Promise.all(
      createOrderDto.orderedServices.map(
        async ({ serviceId, amountOrdered }) => ({
          serviceId: await this.serviceSnapshotsService.pickLatestSnapshotOf(serviceId),
          amountOrdered,
        })
      )
    );
    
    const { id: createdId } = await this.currentTransaction.order.create({
      data: {
        ...createOrderDto,
        orderedPackages: {
          create: orderedPackagesAsSnapshots,
        },
        orderedServices: {
          create: orderedServicesAsSnapshots,
        },
      },
      select: {
        id: true,
      },
    });

    return await this.updateOrderPrice(createdId);
  }

  @Transactional()
  async updateOrderPrice(id: string): Promise<OrderEntity> {
    const order = await this.currentTransaction.order.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        orderedPackages: {
          select: {
            package: {
              select: {
                price: true,
              }
            },
            amountOrdered: true,
          },
        },
        orderedServices: {
          select: {
            service: {
              select: {
                servicePrice: true,
              }
            },
            amountOrdered: true,
          },
        },
      },
    });

    const packagesPrice = order.orderedPackages.reduce(
      (accumulatedPrice, { package: currentPackage, amountOrdered }) =>
        accumulatedPrice.add(
          currentPackage.price.mul(amountOrdered)
        ),
      new Decimal(0),
    );

    const servicesPrice = order.orderedServices.reduce(
      (accumulatedPrice, { service: currentService, amountOrdered }) =>
        accumulatedPrice.add(
          currentService.servicePrice.mul(amountOrdered)
        ),
      new Decimal(0),
    );

    const totalPrice = packagesPrice.add(servicesPrice);

    return await this.currentTransaction.order.update({
      where: {
        id,
      },
      data: {
        price: totalPrice,
      },
      ...selectOrderEntityFields,
    });
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.order.findMany({
      ...selectOrderEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.order.count({
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
  async findOne(id: string): Promise<OrderEntity | null> {
    return await this.currentTransaction.order.findUnique({
      where: {
        id,
      },
      ...selectOrderEntityFields,
    });
  }

  @Transactional()
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return await this.currentTransaction.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
      ...selectOrderEntityFields,
    });
  }

  @Transactional()
  async remove(id: string): Promise<OrderEntity> {
    return await this.currentTransaction.order.delete({
      where: {
        id,
      },
      ...selectOrderEntityFields,
    });
  }
}
