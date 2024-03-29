import { Injectable } from '@nestjs/common';
import {
  HotelPerNight as HotelPerNightModel,
  Service as ServiceModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateHotelPerNightDto,
  createHotelPerNightOnlySchema,
} from './dtos/create-hotel-per-night.dto';
import {
  UpdateHotelPerNightDto,
  updateHotelPerNightOnlySchema,
} from './dtos/update-hotel-per-night.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { HotelPerNightEntity } from './entities/hotel-per-night.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectHotelPerNightEntityFields = {
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

type HotelPerNightRawEntity = HotelPerNightModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawHotelPerNight: HotelPerNightRawEntity,
): HotelPerNightEntity {
  const { asService: serviceFields, ...hotelPerNightFields } = rawHotelPerNight;
  return { ...serviceFields, ...hotelPerNightFields };
}

@Injectable()
export class HotelsPerNightService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createHotelPerNightDto: CreateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createHotelPerNightDto,
        serviceType: ServiceType.HOTEL_PER_NIGHT,
      }), // strip out the HotelPerNight-specific fields
    );

    const createdHotelPerNight =
      await this.currentTransaction.hotelPerNight.create({
        data: {
          ...createHotelPerNightOnlySchema.parse(createHotelPerNightDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectHotelPerNightEntityFields,
      });

    return rawEntityToEntity(createdHotelPerNight);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<HotelPerNightEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.hotelPerNight.findMany({
        ...selectHotelPerNightEntityFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.hotelPerNight.count();

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
  async findOne(id: string): Promise<HotelPerNightEntity | null> {
    const rawHotelPerNight =
      await this.currentTransaction.hotelPerNight.findUnique({
        where: {
          id,
        },
        ...selectHotelPerNightEntityFields,
      });
    return rawHotelPerNight ? rawEntityToEntity(rawHotelPerNight) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateHotelPerNightDto: UpdateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateHotelPerNightDto), // strip out the HotelPerNight-specific fields
    );

    const updatedHotelPerNight =
      await this.currentTransaction.hotelPerNight.update({
        where: {
          id: updatedService.id,
        },
        data: updateHotelPerNightOnlySchema.parse(updateHotelPerNightDto), // strip out the Service-specific fields
        ...selectHotelPerNightEntityFields,
      });

    return rawEntityToEntity(updatedHotelPerNight);
  }

  @Transactional()
  async remove(id: string): Promise<HotelPerNightEntity> {
    const removedHotelPerNight =
      await this.currentTransaction.hotelPerNight.delete({
        where: {
          id,
        },
        ...selectHotelPerNightEntityFields,
      });
    await this.servicesService.remove(id);

    return rawEntityToEntity(removedHotelPerNight);
  }
}
