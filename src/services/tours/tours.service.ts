import { Injectable } from '@nestjs/common';
import {
  Tour as TourModel,
  Service as ServiceModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateTourDto,
  createTourOnlySchema,
} from './dtos/create-tour.dto';
import {
  UpdateTourDto,
  updateTourOnlySchema,
} from './dtos/update-tour.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { TourEntity } from './entities/tour.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectTourFields = {
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

type TourRawEntity = TourModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawTour: TourRawEntity,
): TourEntity {
  const { asService: serviceFields, ...tourFields } = rawTour;
  return { ...serviceFields, ...tourFields };
}

@Injectable()
export class ToursService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createTourDto: CreateTourDto,
  ): Promise<TourEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createTourDto,
        serviceType: ServiceType.HOTEL_PER_NIGHT,
      }), // strip out the Tour-specific fields
    );

    const createdTour =
      await this.currentTransaction.tour.create({
        data: {
          ...createTourOnlySchema.parse(createTourDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectTourFields,
      });

    return rawEntityToEntity(createdTour);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<TourEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.tour.findMany({
        ...selectTourFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.tour.count();

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
  async findOne(id: string): Promise<TourEntity | null> {
    const rawTour =
      await this.currentTransaction.tour.findUnique({
        where: {
          id,
        },
        ...selectTourFields,
      });
    return rawTour ? rawEntityToEntity(rawTour) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateTourDto: UpdateTourDto,
  ): Promise<TourEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateTourDto), // strip out the Tour-specific fields
    );

    const updatedTour =
      await this.currentTransaction.tour.update({
        where: {
          id: updatedService.id,
        },
        data: updateTourOnlySchema.parse(updateTourDto), // strip out the Service-specific fields
        ...selectTourFields,
      });

    return rawEntityToEntity(updatedTour);
  }

  @Transactional()
  async remove(id: string): Promise<TourEntity> {
    const removedTour =
      await this.currentTransaction.tour.delete({
        where: {
          id,
        },
        ...selectTourFields,
      });
    return rawEntityToEntity(removedTour);
  }
}
