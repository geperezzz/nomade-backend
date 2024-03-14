import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ToursService } from '../tours.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { tourOnlySchema } from '../dtos/tour.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class TourSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private toursService: ToursService,
  ) {}

  @Transactional()
  async createSnapshotOf(tourId: string): Promise<string> {
    const originalTour = await this.toursService.findOne(tourId);
    if (!originalTour) {
      throw new Error(
        `Original tour service not found: There is no tour service with ID ${tourId}`
      );
    }

    const { id: snapshotId } = await this.currentTransaction.serviceSnapshot.create({
      data: {
        ...serviceSchema.omit({ id: true, serviceType: true }).parse(originalTour),
        serviceType: ServiceType.TOUR,
        originalServiceId: originalTour.id,
      },
      select: {
        id: true,
      }
    });

    await this.currentTransaction.tourSnapshot.create({
      data: {
        ...tourOnlySchema.parse(originalTour),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
