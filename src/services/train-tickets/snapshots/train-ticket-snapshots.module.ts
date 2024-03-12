import { Module } from '@nestjs/common';

import { TrainTicketSnapshotsService } from './train-ticket-snapshots.service';
import { TrainTicketsModule } from '../train-tickets.module';

@Module({
  imports: [TrainTicketsModule],
  providers: [TrainTicketSnapshotsService],
  exports: [TrainTicketSnapshotsService],
})
export class TrainTicketSnapshotsModule {}
