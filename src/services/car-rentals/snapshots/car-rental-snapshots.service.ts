import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CarRentalsService } from '../car-rentals.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { carRentalOnlySchema } from '../dtos/car-rental.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class CarRentalSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private carRentalsService: CarRentalsService,
  ) {}

  @Transactional()
  async createSnapshotOf(carRentalId: string): Promise<string> {
    const originalCarRental = await this.carRentalsService.findOne(carRentalId);
    if (!originalCarRental) {
      throw new Error(
        `Original car rental service not found: There is no Car rental service with ID ${carRentalId}`
      );
    }

    const { id: snapshotId } = await this.currentTransaction.serviceSnapshot.create({
      data: {
        ...serviceSchema.omit({ id: true, serviceType: true }).parse(originalCarRental),
        serviceType: ServiceType.CAR_RENTAL,
        originalServiceId: originalCarRental.id,
      },
      select: {
        id: true,
      }
    });

    await this.currentTransaction.carRentalSnapshot.create({
      data: {
        ...carRentalOnlySchema.parse(originalCarRental),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
