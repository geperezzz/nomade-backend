import { Injectable } from '@nestjs/common';
import {
  CarRental as CarRentalModel,
  Service as ServiceModel,
} from '@prisma/client';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {
  CreateCarRentalDto,
  createCarRentalOnlySchema,
} from './dtos/create-car-rental.dto';
import {
  UpdateCarRentalDto,
  updateCarRentalOnlySchema,
} from './dtos/update-car-rental.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { CarRentalEntity } from './entities/car-rental.entity';
import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { createServiceSchema } from '../dtos/create-service.dto';
import { updateServiceSchema } from '../dtos/update-service.dto';

const selectCarRentalFields = {
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

type CarRentalRawEntity = CarRentalModel & {
  asService: Omit<ServiceModel, 'id' | 'serviceType'>;
};

function rawEntityToEntity(
  rawCarRental: CarRentalRawEntity,
): CarRentalEntity {
  const { asService: serviceFields, ...carRentalFields } = rawCarRental;
  return { ...serviceFields, ...carRentalFields };
}

@Injectable()
export class CarRentalsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
  ) {}

  @Transactional()
  async create(
    createCarRentalDto: CreateCarRentalDto,
  ): Promise<CarRentalEntity> {
    const createdService = await this.servicesService.create(
      createServiceSchema.parse({
        ...createCarRentalDto,
        serviceType: ServiceType.CAR_RENTAL,
      }), // strip out the CarRental-specific fields
    );

    const createdCarRental =
      await this.currentTransaction.carRental.create({
        data: {
          ...createCarRentalOnlySchema.parse(createCarRentalDto), // strip out the Service-specific fields
          id: createdService.id,
        },
        ...selectCarRentalFields,
      });

    return rawEntityToEntity(createdCarRental);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<CarRentalEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawHotelsPerNight =
      await this.currentTransaction.carRental.findMany({
        ...selectCarRentalFields,
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
    const items = rawHotelsPerNight.map(rawEntityToEntity);

    const itemCount = await this.currentTransaction.carRental.count();

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
  async findOne(id: string): Promise<CarRentalEntity | null> {
    const rawCarRental =
      await this.currentTransaction.carRental.findUnique({
        where: {
          id,
        },
        ...selectCarRentalFields,
      });
    return rawCarRental ? rawEntityToEntity(rawCarRental) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateCarRentalDto: UpdateCarRentalDto,
  ): Promise<CarRentalEntity> {
    const updatedService = await this.servicesService.update(
      id,
      updateServiceSchema.parse(updateCarRentalDto), // strip out the CarRental-specific fields
    );

    const updatedCarRental =
      await this.currentTransaction.carRental.update({
        where: {
          id: updatedService.id,
        },
        data: updateCarRentalOnlySchema.parse(updateCarRentalDto), // strip out the Service-specific fields
        ...selectCarRentalFields,
      });

    return rawEntityToEntity(updatedCarRental);
  }

  @Transactional()
  async remove(id: string): Promise<CarRentalEntity> {
    const removedCarRental =
      await this.currentTransaction.carRental.delete({
        where: {
          id,
        },
        ...selectCarRentalFields,
      });
    await this.servicesService.remove(id);
    
    return rawEntityToEntity(removedCarRental);
  }
}
