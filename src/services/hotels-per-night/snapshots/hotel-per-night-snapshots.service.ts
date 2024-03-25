import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { HotelsPerNightService } from '../hotels-per-night.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { hotelPerNightOnlySchema } from '../dtos/hotel-per-night.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class HotelPerNightSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private hotelsPerNightService: HotelsPerNightService,
  ) {}

  @Transactional()
  async createSnapshotOf(hotelPerNightId: string): Promise<string> {
    const originalHotelPerNight =
      await this.hotelsPerNightService.findOne(hotelPerNightId);
    if (!originalHotelPerNight) {
      throw new Error(
        `Original hotel per night service not found: There is no Hotel per night service with ID ${hotelPerNightId}`,
      );
    }

    const { id: snapshotId } =
      await this.currentTransaction.serviceSnapshot.create({
        data: {
          ...serviceSchema
            .omit({ id: true, serviceType: true })
            .parse(originalHotelPerNight),
          serviceType: ServiceType.HOTEL_PER_NIGHT,
          originalServiceId: originalHotelPerNight.id,
        },
        select: {
          id: true,
        },
      });

    await this.currentTransaction.hotelPerNightSnapshot.create({
      data: {
        ...hotelPerNightOnlySchema.parse(originalHotelPerNight),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
