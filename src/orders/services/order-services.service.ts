import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { OrderService as OrderServiceModel, ServiceSnapshot as ServiceSnapshotModel } from '@prisma/client';

import { CreateOrderServiceDto } from './dtos/create-order-service.dto';
import { UpdateOrderServiceDto } from './dtos/update-order-service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderServiceEntity } from './entities/order-service.entity';
import { OrdersService } from '../orders.service';
import { ServiceSnapshotsService } from 'src/services/snapshots/service-snapshots.service';

const selectOrderServiceEntityFields = {
  select: {
    serviceSnapshot: true,
    amountOrdered: true,
  },
} as const;

type OrderServiceRawEntity = Omit<OrderServiceModel, 'orderId' | 'serviceSnapshotId'> & {
  serviceSnapshot: ServiceSnapshotModel, 
};

function rawEntityToEntity(rawOrderService: OrderServiceRawEntity): OrderServiceEntity {
  const { serviceSnapshot, ...restOfOrderServiceFields } = rawOrderService;
  const { originalServiceId, ...serviceSnapshotWithoutOriginalServiceId } = serviceSnapshot;

  return {
    ...restOfOrderServiceFields,
    serviceId: originalServiceId,
    serviceSnapshot: serviceSnapshotWithoutOriginalServiceId,
  };
}

@Injectable()
export class OrderServicesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    private serviceSnapshotsService: ServiceSnapshotsService,
  ) {}

  @Transactional()
  async create(orderId: string, createOrderServiceDto: CreateOrderServiceDto): Promise<OrderServiceEntity> {
    const [createdOrderService] = await this.createMany(orderId, [createOrderServiceDto]);
    return createdOrderService;
  }

  @Transactional()
  async createMany(orderId: string, createOrderServiceDtos: CreateOrderServiceDto[]): Promise<OrderServiceEntity[]> {
    const createdOrderServices = await Promise.all(
      createOrderServiceDtos.map(async (createOrderServiceDto) => {
        const serviceSnapshotId = createOrderServiceDto.serviceSnapshot?.id
          ?? await this.serviceSnapshotsService.pickLatestSnapshotOf(createOrderServiceDto.serviceId);
        
        const createdOrderService = await this.currentTransaction.orderService.create({
          data: {
            amountOrdered: createOrderServiceDto.amountOrdered,
            orderId,
            serviceSnapshotId,
          },
          ...selectOrderServiceEntityFields,
        });

        return rawEntityToEntity(createdOrderService);
      })
    );

    await this.ordersService.updateOrderPrice(orderId);

    return createdOrderServices;
  }

  @Transactional()
  async findMany(
    orderId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderServiceEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawOrderServices = await this.currentTransaction.orderService.findMany({
      where: {
        orderId,
      },
      ...selectOrderServiceEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    const items = rawOrderServices.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.orderService.count({
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
  async findAll(orderId: string): Promise<OrderServiceEntity[]> {
    const rawOrderServices = await this.currentTransaction.orderService.findMany({
      where: {
        orderId,
      },
      ...selectOrderServiceEntityFields,
    });
    return rawOrderServices.map(rawEntityToEntity);
  }

  @Transactional()
  async findOne(orderId: string, serviceId: string): Promise<OrderServiceEntity | null> {
    const rawOrderService = await this.currentTransaction.orderService.findFirst({
      where: {
        orderId,
        serviceSnapshot: {
          originalServiceId: serviceId,
        },
      },
      ...selectOrderServiceEntityFields,
    });
    return rawOrderService ? rawEntityToEntity(rawOrderService) : null;
  }

  @Transactional()
  async update(
    orderId: string,
    serviceId: string,
    updateOrderServiceDto: UpdateOrderServiceDto,
  ): Promise<OrderServiceEntity> {
    let newServiceId = serviceId;
    let newServiceSnapshotId = updateOrderServiceDto.serviceSnapshot?.id;
    if (updateOrderServiceDto.serviceId) {
      newServiceId = updateOrderServiceDto.serviceId;
      newServiceSnapshotId ??= await this.serviceSnapshotsService.pickLatestSnapshotOf(updateOrderServiceDto.serviceId);
    }
    
    await this.currentTransaction.orderService.updateMany({
      where: {
        orderId,
        serviceSnapshot: {
          originalServiceId: serviceId,
        },
      },
      data: {
        serviceSnapshotId: newServiceSnapshotId,
        amountOrdered: updateOrderServiceDto.amountOrdered,
      },
    });

    await this.ordersService.updateOrderPrice(orderId);

    const updatedOrderService = (await this.findOne(orderId, newServiceId)) as OrderServiceEntity;
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
        serviceSnapshot: {
          originalServiceId: serviceId,
        },
      },
    });

    return removedOrderService;
  }
}
