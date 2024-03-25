import { Injectable } from '@nestjs/common';
import { Event as EventModel, Service as ServiceModel } from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateEventDto, createEventOnlySchema } from './dtos/create-event.dto';
import { UpdateEventDto, updateEventOnlySchema } from './dtos/update-event.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { EventEntity } from './entities/event.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectEventFields = {
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

type EventRawEntity = EventModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(rawEvent: EventRawEntity): EventEntity {
  const { asService: serviceFields, ...eventFields } = rawEvent;
  return { ...serviceFields, ...eventFields };
}

@Injectable()
export class EventsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createEventDto,
        serviceType: ServiceType.EVENT,
      }), // strip out the Event-specific fields
    );

    const createdEvent = await this.currentTransaction.event.create({
      data: {
        ...createEventOnlySchema.parse(createEventDto), // strip out the Service-specific fields
        id: createdService.id,
      },
      ...selectEventFields,
    });

    return rawEntityToEntity(createdEvent);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<EventEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight = await this.currentTransaction.event.findMany({
      ...selectEventFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.event.count();

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
  async findOne(id: string): Promise<EventEntity | null> {
    const rawEvent = await this.currentTransaction.event.findUnique({
      where: {
        id,
      },
      ...selectEventFields,
    });
    return rawEvent ? rawEntityToEntity(rawEvent) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateEventDto), // strip out the Event-specific fields
    );

    const updatedEvent = await this.currentTransaction.event.update({
      where: {
        id: updatedService.id,
      },
      data: updateEventOnlySchema.parse(updateEventDto), // strip out the Service-specific fields
      ...selectEventFields,
    });

    return rawEntityToEntity(updatedEvent);
  }

  @Transactional()
  async remove(id: string): Promise<EventEntity> {
    const removedEvent = await this.currentTransaction.event.delete({
      where: {
        id,
      },
      ...selectEventFields,
    });
    await this.servicesService.remove(id);

    return rawEntityToEntity(removedEvent);
  }
}
