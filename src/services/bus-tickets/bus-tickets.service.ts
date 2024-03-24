import { Injectable } from '@nestjs/common';
import {
  BusTicket as BusTicketModel,
  Service as ServiceModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateBusTicketDto,
  createBusTicketOnlySchema,
} from './dtos/create-bus-ticket.dto';
import {
  UpdateBusTicketDto,
  updateBusTicketOnlySchema,
} from './dtos/update-bus-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { BusTicketEntity } from './entities/bus-ticket.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectBusTicketFields = {
  include: {
    asService: {
      select: {
        lastUpdateTimestamp: true,
        serviceName: true,
        serviceDescription: true,
        serviceLocation: true,
        servicePrice: true,
        serviceTimestamp: true,
      },
    },
  },
} as const;

type BusTicketRawEntity = BusTicketModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawBusTicket: BusTicketRawEntity,
): BusTicketEntity {
  const { asService: serviceFields, ...busTicketFields } = rawBusTicket;
  return { ...serviceFields, ...busTicketFields };
}

@Injectable()
export class BusTicketsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createBusTicketDto: CreateBusTicketDto,
  ): Promise<BusTicketEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createBusTicketDto,
        serviceType: ServiceType.BUS_TICKET,
      }), // strip out the BusTicket-specific fields
    );

    const createdBusTicket =
      await this.currentTransaction.busTicket.create({
        data: {
          ...createBusTicketOnlySchema.parse(createBusTicketDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectBusTicketFields,
      });

    return rawEntityToEntity(createdBusTicket);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<BusTicketEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.busTicket.findMany({
        ...selectBusTicketFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.busTicket.count();

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
  async findOne(id: string): Promise<BusTicketEntity | null> {
    const rawBusTicket =
      await this.currentTransaction.busTicket.findUnique({
        where: {
          id,
        },
        ...selectBusTicketFields,
      });
    return rawBusTicket ? rawEntityToEntity(rawBusTicket) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateBusTicketDto: UpdateBusTicketDto,
  ): Promise<BusTicketEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateBusTicketDto), // strip out the BusTicket-specific fields
    );

    const updatedBusTicket =
      await this.currentTransaction.busTicket.update({
        where: {
          id: updatedService.id,
        },
        data: updateBusTicketOnlySchema.parse(updateBusTicketDto), // strip out the Service-specific fields
        ...selectBusTicketFields,
      });

    return rawEntityToEntity(updatedBusTicket);
  }

  @Transactional()
  async remove(id: string): Promise<BusTicketEntity> {
    const removedBusTicket =
      await this.currentTransaction.busTicket.delete({
        where: {
          id,
        },
        ...selectBusTicketFields,
      });
    await this.servicesService.remove(id);
    
    return rawEntityToEntity(removedBusTicket);
  }
}
