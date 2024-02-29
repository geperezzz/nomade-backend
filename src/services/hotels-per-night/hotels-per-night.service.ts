import { Injectable } from '@nestjs/common';

import { CreateHotelPerNightDto } from './dtos/create-hotel-per-night.dto';
import { UpdateHotelPerNightDto } from './dtos/update-hotel-per-night.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.interface';
import { HotelPerNightEntity } from './entities/hotel-per-night.entity';
import {
  HotelPerNight as HotelPerNightModel,
  Service as ServiceModel,
  ServiceType,
} from '@prisma/client';

type HotelPerNightRawEntity = HotelPerNightModel & {
  asService: ServiceModel;
};

function rawEntityToEntity(
  rawHotelPerNight: HotelPerNightRawEntity,
): HotelPerNightEntity {
  const { asService: serviceModel, ...hotelPerNightModel } = rawHotelPerNight;
  return {
    serviceName: serviceModel.name,
    serviceDescription: serviceModel.description,
    serviceLocation: serviceModel.serviceLocation,
    servicePrice: serviceModel.price,
    serviceTimestamp: serviceModel.serviceTimestamp,
    ...hotelPerNightModel,
  };
}

@Injectable()
export class HotelsPerNightService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createHotelPerNightDto: CreateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    const createdService = await this.prismaService.service.create({
      data: {
        ...createHotelPerNightDto,
        name: createHotelPerNightDto.serviceName,
        description: createHotelPerNightDto.serviceDescription,
        price: createHotelPerNightDto.servicePrice,
        serviceType: ServiceType.HOTEL_PER_NIGHT,
      },
    });

    const createdHotelPerNight = await this.prismaService.hotelPerNight.create({
      data: {
        ...createHotelPerNightDto,
        id: createdService.id,
      },
      include: {
        asService: true,
      },
    });

    return rawEntityToEntity(createdHotelPerNight);
  }

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<HotelPerNightEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const [rawHotelsPerNight, itemCount] =
      await this.prismaService.$transaction([
        this.prismaService.hotelPerNight.findMany({
          include: {
            asService: true,
          },
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
      include: {
        asService: true,
      },
    });
    return rawHotelPerNight ? rawEntityToEntity(rawHotelPerNight) : null;
  }

  async update(
    id: string,
    updateHotelPerNightDto: UpdateHotelPerNightDto,
  ): Promise<HotelPerNightEntity> {
    const updatedHotelPerNight = await this.prismaService.hotelPerNight.update({
      where: {
        id,
      },
      data: updateHotelPerNightDto,
      include: {
        asService: true,
      },
    });
    return rawEntityToEntity(updatedHotelPerNight);
  }

  async remove(id: string): Promise<HotelPerNightEntity> {
    const removedHotelPerNight = await this.prismaService.hotelPerNight.delete({
      where: {
        id,
      },
      include: {
        asService: true,
      },
    });
    return rawEntityToEntity(removedHotelPerNight);
  }
}
