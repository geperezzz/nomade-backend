import { Module } from '@nestjs/common';

import { EventSnapshotsService } from './event-snapshots.service';
import { EventsModule } from '../events.module';

@Module({
  imports: [EventsModule],
  providers: [EventSnapshotsService],
  exports: [EventSnapshotsService],
})
export class EventSnapshotsModule {}
