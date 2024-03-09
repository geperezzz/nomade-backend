import { Injectable } from '@nestjs/common';
import { InjectTransaction, Transaction, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ServicesService } from '../services.service';
import { ServiceType } from '../entities/service.entity';
import { HotelPerNightSnapshotsService } from '../hotels-per-night/snapshots/hotel-per-night-snapshots.service';

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
  ) {
    this.snapshotServices = new Map([
      [ServiceType.HOTEL_PER_NIGHT, this.hotelPerNightSnapshotsService]
    ]);
  }

  @Transactional()
  async pickLatestSnapshotOf(serviceId: string): Promise<string> {
    const originalService = await this.servicesService.findOne(serviceId);
    if (!originalService) {
      throw new Error(
        `Original service not found: There is no Service with ID ${serviceId}`
      );
    }

    const latestSnapshot = await this.currentTransaction.serviceSnapshot.findFirst({
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

    if (!latestSnapshot || latestSnapshot.snapshotTimestamp < originalService.lastUpdateTimestamp) {
      return this.createSnapshotOf(serviceId);
    }
    return latestSnapshot.id;
  }

  @Transactional()
  async createSnapshotOf(serviceId: string): Promise<string> {
    const originalService = await this.servicesService.findOne(serviceId);
    if (!originalService) {
      throw new Error(
        `Original service not found: There is no Service with ID ${serviceId}`
      );
    }
    
    const snapshotService = this.snapshotServices.get(originalService.serviceType)!;
    return snapshotService.createSnapshotOf(serviceId);
  }
}