import { Injectable } from '@nestjs/common';
import {
  Service as ServiceModel,
  TrainTicket as TrainTicketModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateTrainTicketDto,
  createTrainTicketOnlySchema,
} from './dtos/create-train-ticket.dto';
import {
  UpdateTrainTicketDto,
  updateTrainTicketOnlySchema,
} from './dtos/update-train-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { TrainTicketEntity } from './entities/train-ticket.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectTrainTicketFields = {
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

type TrainTicketRawEntity = TrainTicketModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawTrainTicket: TrainTicketRawEntity,
): TrainTicketEntity {
  const { asService: serviceFields, ...trainTicketFields } = rawTrainTicket;
  return { ...serviceFields, ...trainTicketFields };
}

@Injectable()
export class TrainTicketsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createTrainTicketDto: CreateTrainTicketDto,
  ): Promise<TrainTicketEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createTrainTicketDto,
        serviceType: ServiceType.TRAIN_TICKET,
      }), // strip out the TrainTicket-specific fields
    );

    const createdTrainTicket =
      await this.currentTransaction.trainTicket.create({
        data: {
          ...createTrainTicketOnlySchema.parse(createTrainTicketDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectTrainTicketFields,
      });

    return rawEntityToEntity(createdTrainTicket);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<TrainTicketEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.trainTicket.findMany({
        ...selectTrainTicketFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.trainTicket.count();

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
  async findOne(id: string): Promise<TrainTicketEntity | null> {
    const rawTrainTicket =
      await this.currentTransaction.trainTicket.findUnique({
        where: {
          id,
        },
        ...selectTrainTicketFields,
      });
    return rawTrainTicket ? rawEntityToEntity(rawTrainTicket) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateTrainTicketDto: UpdateTrainTicketDto,
  ): Promise<TrainTicketEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateTrainTicketDto), // strip out the TrainTicket-specific fields
    );

    const updatedTrainTicket =
      await this.currentTransaction.trainTicket.update({
        where: {
          id: updatedService.id,
        },
        data: updateTrainTicketOnlySchema.parse(updateTrainTicketDto), // strip out the Service-specific fields
        ...selectTrainTicketFields,
      });

    return rawEntityToEntity(updatedTrainTicket);
  }

  @Transactional()
  async remove(id: string): Promise<TrainTicketEntity> {
    const removedTrainTicket =
      await this.currentTransaction.trainTicket.delete({
        where: {
          id,
        },
        ...selectTrainTicketFields,
      });
    await this.servicesService.remove(id);
    
    return rawEntityToEntity(removedTrainTicket);
  }
}
