import { Module } from '@nestjs/common';

import { CarRentalSnapshotsService } from './car-rental-snapshots.service';
import { CarRentalsModule } from '../car-rentals.module';

@Module({
  imports: [CarRentalsModule],
  providers: [CarRentalSnapshotsService],
  exports: [CarRentalSnapshotsService],
})
export class CarRentalSnapshotsModule {}
