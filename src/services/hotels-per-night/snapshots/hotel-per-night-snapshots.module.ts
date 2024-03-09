import { Module } from '@nestjs/common';

import { HotelPerNightSnapshotsService } from './hotel-per-night-snapshots.service';
import { HotelsPerNightModule } from '../hotels-per-night.module';

@Module({
  imports: [HotelsPerNightModule],
  providers: [HotelPerNightSnapshotsService],
  exports: [HotelPerNightSnapshotsService],
})
export class HotelPerNightSnapshotsModule {}
