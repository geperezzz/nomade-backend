import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import Decimal from 'decimal.js';
import { Order as OrderModel } from '@prisma/client';

import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderEntity } from './entities/order.entity';
import { OrderPackagesService } from './packages/order-packages.service';
import { OrderServicesService } from './services/order-services.service';
import { OrderPaymentsService } from './payments/order-payments.service';
import { ReplaceOrderDto } from './dtos/replace-order.dto';

type OrderRawEntity = OrderModel;

@Injectable()
export class OrdersService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    @Inject(forwardRef(() => OrderPackagesService))
    private orderPackagesService: OrderPackagesService,
    @Inject(forwardRef(() => OrderServicesService))
    private orderServicesService: OrderServicesService,
    @Inject(forwardRef(() => OrderPaymentsService))
    private orderPaymentsService: OrderPaymentsService,
  ) {}

  @Transactional()
  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { id: createdId } = await this.currentTransaction.order.create({
      data: {
        ...createOrderDto,
        orderedPackages: undefined,
        orderedServices: undefined,
      },
      select: {
        id: true,
      },
    });
    
    await this.orderPackagesService.createMany(createdId, createOrderDto.orderedPackages);
    await this.orderServicesService.createMany(createdId, createOrderDto.orderedServices);

    return (await this.findOne(createdId))!;
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
            packageSnapshot: {
              select: {
                price: true,
              }
            },
            amountOrdered: true,
          },
        },
        orderedServices: {
          select: {
            serviceSnapshot: {
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
      (accumulatedPrice, { packageSnapshot: currentPackage, amountOrdered }) =>
        accumulatedPrice.add(
          currentPackage.price.mul(amountOrdered)
        ),
      new Decimal(0),
    );

    const servicesPrice = order.orderedServices.reduce(
      (accumulatedPrice, { serviceSnapshot: currentService, amountOrdered }) =>
        accumulatedPrice.add(
          currentService.servicePrice.mul(amountOrdered)
        ),
      new Decimal(0),
    );

    const totalPrice = packagesPrice.add(servicesPrice);

    const updatedOrder = await this.currentTransaction.order.update({
      where: {
        id,
      },
      data: {
        price: totalPrice,
      },
    });
    return await this.rawEntityToEntity(updatedOrder);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawOrders = await this.currentTransaction.order.findMany({
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    const items = await Promise.all(
      rawOrders.map(rawOrder => this.rawEntityToEntity(rawOrder))
    );

    const itemCount = await this.currentTransaction.order.count();

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
    const rawOrder = await this.currentTransaction.order.findUnique({
      where: {
        id,
      },
    });
    return rawOrder ? await this.rawEntityToEntity(rawOrder) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const updatedOrder = await this.currentTransaction.order.update({
      where: {
        id,
      },
      data: {
        ...updateOrderDto,
      },
    });
    
    return await this.rawEntityToEntity(updatedOrder);
  }

  @Transactional()
  async replace(
    id: string,
    replaceOrderDto: ReplaceOrderDto,
  ): Promise<OrderEntity> {
    const { id: newId } = await this.currentTransaction.order.update({
      where: {
        id,
      },
      data: {
        ...replaceOrderDto,
        orderedPackages: {
          deleteMany: {},
        },
        orderedServices: {
          deleteMany: {},
        },
      },
      select: {
        id: true,
      },
    });
    
    await this.orderPackagesService.createMany(newId, replaceOrderDto.orderedPackages);
    await this.orderServicesService.createMany(newId, replaceOrderDto.orderedServices);

    return (await this.findOne(newId))!;
  }

  @Transactional()
  async remove(id: string): Promise<OrderEntity> {
    const removedOrder = await this.currentTransaction.order.delete({
      where: {
        id,
      },
    });
    return await this.rawEntityToEntity(removedOrder);
  }

  @Transactional()
  async rawEntityToEntity(rawOrder: OrderRawEntity): Promise<OrderEntity> {
    const [
      orderedPackages,
      orderedServices,
      payments,
    ] = await Promise.all([
      this.orderPackagesService.findAll(rawOrder.id),
      this.orderServicesService.findAll(rawOrder.id),
      this.orderPaymentsService.findAll(rawOrder.id),
    ]);
    
    return {
      ...rawOrder,
      orderedPackages,
      orderedServices,
      payments,
    };
  }
}
