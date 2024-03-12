import { Module } from '@nestjs/common';

import { TourSnapshotsService } from './tour-snapshots.service';
import { ToursModule } from '../tours.module';

@Module({
  imports: [ToursModule],
  providers: [TourSnapshotsService],
  exports: [TourSnapshotsService],
})
export class TourSnapshotsModule {}
