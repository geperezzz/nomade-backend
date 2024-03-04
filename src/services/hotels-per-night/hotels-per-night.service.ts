import { Injectable } from '@nestjs/common';
import {
  HotelPerNight as HotelPerNightModel,
  Service as ServiceModel,
} from '@prisma/client';

import { CreateHotelPerNightDto } from './dtos/create-hotel-per-night.dto';
import { UpdateHotelPerNightDto } from './dtos/update-hotel-per-night.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { HotelPerNightEntity } from './entities/hotel-per-night.entity';
import { serviceSchema } from '../dtos/service.dto';
import { hotelPerNightOnlySchema } from './dtos/hotel-per-night.dto';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';

const selectHotelPerNightEntityFields = {
  include: {
    asService: {
      select: {
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
  asService: Omit<ServiceModel, 'id' | 'lastUpdateTimestamp' | 'serviceType'>;
};

function rawEntityToEntity(
  rawHotelPerNight: HotelPerNightRawEntity,
): HotelPerNightEntity {
  const { asService: serviceFields, ...hotelPerNightFields } = rawHotelPerNight;
  return { ...serviceFields, ...hotelPerNightFields };
}

@Injectable()
export class HotelsPerNightService {
  constructor(private prismaService: PrismaService, private servicesService: ServicesService) {}

  async create(
    createHotelPerNightDto: CreateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    return this.prismaService.$transaction(async (transactionClient) => {
      const createdService = await this.servicesService.create(
        serviceSchema.parse({
          ...createHotelPerNightDto,
          serviceType: ServiceType.HOTEL_PER_NIGHT,
          transactionClient,
        }) // strip out the HotelPerNight-specific fields
      );

      const createdHotelPerNight = await transactionClient.hotelPerNight.create({
        data: {
          ...hotelPerNightOnlySchema.parse(createHotelPerNightDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectHotelPerNightEntityFields,
      });

      return rawEntityToEntity(createdHotelPerNight);
    });
  }

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<HotelPerNightEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const [rawHotelsPerNight, itemCount] =
      await this.prismaService.$transaction([
        this.prismaService.hotelPerNight.findMany({
          ...selectHotelPerNightEntityFields,
          skip: itemsPerPage * (pageIndex - 1),
          take: itemsPerPage,
        }),
        this.prismaService.hotelPerNight.count({
          skip: itemsPerPage * (pageIndex - 1),
          take: itemsPerPage,
        }),
      ]);

    const items = rawHotelsPerNight.map(rawEntityToEntity);
    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  async findOne(id: string): Promise<HotelPerNightEntity | null> {
    const rawHotelPerNight = await this.prismaService.hotelPerNight.findUnique({
      where: {
        id,
      },
      ...selectHotelPerNightEntityFields,
    });
    return rawHotelPerNight ? rawEntityToEntity(rawHotelPerNight) : null;
  }

  async update(
    id: string,
    updateHotelPerNightDto: UpdateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    return this.prismaService.$transaction(async (transactionClient) => {
      const updatedService = await this.servicesService.update(
        id,
        serviceSchema.parse(updateHotelPerNightDto), // strip out the HotelPerNight-specific fields
        transactionClient,
      );
      
      const updatedHotelPerNight = await this.prismaService.hotelPerNight.update({
        where: {
          id: updatedService.id,
        },
        data: hotelPerNightOnlySchema.parse(updateHotelPerNightDto), // strip out the Service-specific fields
        ...selectHotelPerNightEntityFields,
      });

      return rawEntityToEntity(updatedHotelPerNight);
    });
  }

  async remove(id: string): Promise<HotelPerNightEntity> {
    const removedHotelPerNight = await this.prismaService.hotelPerNight.delete({
      where: {
        id,
      },
      ...selectHotelPerNightEntityFields,
    });
    return rawEntityToEntity(removedHotelPerNight);
  }
}
