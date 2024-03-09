import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateOrderServiceDto } from './dtos/create-order-service.dto';
import { UpdateOrderServiceDto } from './dtos/update-order-service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderServiceEntity } from './entities/order-service.entity';
import { OrdersService } from '../orders.service';
import { ServiceSnapshotsService } from 'src/services/snapshots/service-snapshots.service';

const selectOrderServiceEntityFields = {
  select: {
    serviceId: true,
    amountOrdered: true,
  },
} as const;

@Injectable()
export class OrderServicesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private ordersService: OrdersService,
    private serviceSnapshotsService: ServiceSnapshotsService,
  ) {}

  @Transactional()
  async create(orderId: string, createOrderServiceDto: CreateOrderServiceDto): Promise<OrderServiceEntity> {
    const createdOrderService = await this.currentTransaction.orderService.create({
      data: {
        ...createOrderServiceDto,
        orderId,
        serviceId: await this.serviceSnapshotsService.pickLatestSnapshotOf(createOrderServiceDto.serviceId),
      },
      ...selectOrderServiceEntityFields,
    });

    await this.ordersService.updateOrderPrice(orderId);

    return createdOrderService;
  }

  @Transactional()
  async findMany(
    orderId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderServiceEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.orderService.findMany({
      where: {
        orderId,
      },
      ...selectOrderServiceEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.orderService.count({
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
  async findOne(orderId: string, serviceId: string): Promise<OrderServiceEntity | null> {
    return await this.currentTransaction.orderService.findFirst({
      where: {
        orderId,
        service: {
          originalServiceId: serviceId,
        },
      },
      ...selectOrderServiceEntityFields,
    });
  }

  @Transactional()
  async update(
    orderId: string,
    serviceId: string,
    updateOrderServiceDto: UpdateOrderServiceDto,
  ): Promise<OrderServiceEntity> {
    let updatedServiceId!: string;
    if (updateOrderServiceDto.serviceId) {
      updatedServiceId = await this.serviceSnapshotsService.pickLatestSnapshotOf(updateOrderServiceDto.serviceId);
    } else {
      updatedServiceId = serviceId;
    }
    
    await this.currentTransaction.orderService.updateMany({
      where: {
        orderId,
        service: {
          originalServiceId: serviceId,
        },
      },
      data: {
        ...updateOrderServiceDto,
        serviceId: updatedServiceId,
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    const updatedOrderService = await this.findOne(orderId, updatedServiceId);
    if (!updatedOrderService) {
      throw new Error(
        `Order package not found: There is no Order with ID ${orderId} that has a Service with ID ${updatedServiceId}`
      );
    }
    return updatedOrderService;
  }

  @Transactional()
  async remove(orderId: string, serviceId: string): Promise<OrderServiceEntity> {
    const removedOrderService = await this.findOne(orderId, serviceId);
    if (!removedOrderService) {
      throw new Error(
        `Order package not found: There is no Order with ID ${orderId} that has a Service with ID ${serviceId}`
      );
    }
    
    await this.currentTransaction.orderService.deleteMany({
      where: {
        orderId,
        service: {
          originalServiceId: serviceId,
        },
      },
    });

    return removedOrderService;
  }
}
