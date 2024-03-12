import { Injectable } from '@nestjs/common';
import {
  AirlineTicket as AirlineTicketModel,
  Service as ServiceModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateAirlineTicketDto,
  createAirlineTicketOnlySchema,
} from './dtos/create-airline-ticket.dto';
import {
  UpdateAirlineTicketDto,
  updateAirlineTicketOnlySchema,
} from './dtos/update-airline-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { AirlineTicketEntity } from './entities/airline-ticket.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectAirlineTicketFields = {
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

type AirlineTicketRawEntity = AirlineTicketModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawAirlineTicket: AirlineTicketRawEntity,
): AirlineTicketEntity {
  const { asService: serviceFields, ...airlineTicketFields } = rawAirlineTicket;
  return { ...serviceFields, ...airlineTicketFields };
}

@Injectable()
export class AirlineTicketsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createAirlineTicketDto: CreateAirlineTicketDto,
  ): Promise<AirlineTicketEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createAirlineTicketDto,
        serviceType: ServiceType.HOTEL_PER_NIGHT,
      }), // strip out the AirlineTicket-specific fields
    );

    const createdAirlineTicket =
      await this.currentTransaction.airlineTicket.create({
        data: {
          ...createAirlineTicketOnlySchema.parse(createAirlineTicketDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectAirlineTicketFields,
      });

    return rawEntityToEntity(createdAirlineTicket);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<AirlineTicketEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.airlineTicket.findMany({
        ...selectAirlineTicketFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.airlineTicket.count();

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
  async findOne(id: string): Promise<AirlineTicketEntity | null> {
    const rawAirlineTicket =
      await this.currentTransaction.airlineTicket.findUnique({
        where: {
          id,
        },
        ...selectAirlineTicketFields,
      });
    return rawAirlineTicket ? rawEntityToEntity(rawAirlineTicket) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateAirlineTicketDto: UpdateAirlineTicketDto,
  ): Promise<AirlineTicketEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateAirlineTicketDto), // strip out the AirlineTicket-specific fields
    );

    const updatedAirlineTicket =
      await this.currentTransaction.airlineTicket.update({
        where: {
          id: updatedService.id,
        },
        data: updateAirlineTicketOnlySchema.parse(updateAirlineTicketDto), // strip out the Service-specific fields
        ...selectAirlineTicketFields,
      });

    return rawEntityToEntity(updatedAirlineTicket);
  }

  @Transactional()
  async remove(id: string): Promise<AirlineTicketEntity> {
    const removedAirlineTicket =
      await this.currentTransaction.airlineTicket.delete({
        where: {
          id,
        },
        ...selectAirlineTicketFields,
      });
    return rawEntityToEntity(removedAirlineTicket);
  }
}
