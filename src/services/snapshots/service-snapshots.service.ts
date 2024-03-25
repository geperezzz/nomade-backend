import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { HotelPerNightSnapshotsService } from '../hotels-per-night/snapshots/hotel-per-night-snapshots.service';
import { CarRentalSnapshotsService } from '../car-rentals/snapshots/car-rental-snapshots.service';
import { BusTicketSnapshotsService } from '../bus-tickets/snapshots/bus-ticket-snapshots.service';
import { AirlineTicketSnapshotsService } from '../airline-tickets/snapshots/airline-ticket-snapshots.service';
import { TrainTicketSnapshotsService } from '../train-tickets/snapshots/train-ticket-snapshots.service';
import { TourSnapshotsService } from '../tours/snapshots/tour-snapshots.service';
import { EventSnapshotsService } from '../events/snapshots/event-snapshots.service';

interface SnapshotService {
  createSnapshotOf(serviceId: string): Promise<string>;
}

@Injectable()
export class ServiceSnapshotsService {
  private snapshotServices: Map<ServiceType, SnapshotService>;

  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private servicesService: ServicesService,
    private hotelPerNightSnapshotsService: HotelPerNightSnapshotsService,
    private carRentalSnapshotsService: CarRentalSnapshotsService,
    private busTicketSnapshotsService: BusTicketSnapshotsService,
    private airlineTicketSnapshotsService: AirlineTicketSnapshotsService,
    private trainTicketSnapshotsService: TrainTicketSnapshotsService,
    private tourSnapshotsService: TourSnapshotsService,
    private eventSnapshotService: EventSnapshotsService,
  ) {
    this.snapshotServices = new Map<ServiceType, SnapshotService>([
      [ServiceType.HOTEL_PER_NIGHT, this.hotelPerNightSnapshotsService],
      [ServiceType.CAR_RENTAL, this.carRentalSnapshotsService],
      [ServiceType.BUS_TICKET, this.busTicketSnapshotsService],
      [ServiceType.AIRLINE_TICKET, this.airlineTicketSnapshotsService],
      [ServiceType.TRAIN_TICKET, this.trainTicketSnapshotsService],
      [ServiceType.TOUR, this.tourSnapshotsService],
      [ServiceType.EVENT, this.eventSnapshotService],
    ]);
  }

  @Transactional()
  async pickLatestSnapshotOf(serviceId: string): Promise<string> {
    const originalService = await this.servicesService.findOne(serviceId);
    if (!originalService) {
      throw new Error(
        `Original service not found: There is no Service with ID ${serviceId}`,
      );
    }

    const latestSnapshot =
      await this.currentTransaction.serviceSnapshot.findFirst({
        where: {
          originalServiceId: serviceId,
        },
        orderBy: {
          snapshotTimestamp: 'desc',
        },
        select: {
          id: true,
          snapshotTimestamp: true,
        },
      });

    if (
      !latestSnapshot ||
      latestSnapshot.snapshotTimestamp < originalService.lastUpdateTimestamp
    ) {
      return this.createSnapshotOf(serviceId);
    }
    return latestSnapshot.id;
  }

  @Transactional()
  async createSnapshotOf(serviceId: string): Promise<string> {
    const originalService = await this.servicesService.findOne(serviceId);
    if (!originalService) {
      throw new Error(
        `Original service not found: There is no Service with ID ${serviceId}`,
      );
    }

    const snapshotService = this.snapshotServices.get(
      originalService.serviceType,
    )!;
    return snapshotService.createSnapshotOf(serviceId);
  }
}
