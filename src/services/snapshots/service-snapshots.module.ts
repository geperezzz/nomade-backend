import { Module } from '@nestjs/common';

import { ServiceSnapshotsService } from './service-snapshots.service';
import { ServicesModule } from '../services.module';
import { HotelPerNightSnapshotsModule } from '../hotels-per-night/snapshots/hotel-per-night-snapshots.module';
import { CarRentalSnapshotsModule } from '../car-rentals/snapshots/car-rental-snapshots.module';

@Module({
  imports: [
    ServicesModule,
    HotelPerNightSnapshotsModule,
    CarRentalSnapshotsModule,
  ],
  providers: [ServiceSnapshotsService],
  exports: [ServiceSnapshotsService],
})
export class ServiceSnapshotsModule {}
