import { Module } from '@nestjs/common';

import { BusTicketSnapshotsService } from './bus-ticket-snapshots.service';
import { BusTicketsModule } from '../bus-tickets.module';

@Module({
  imports: [BusTicketsModule],
  providers: [BusTicketSnapshotsService],
  exports: [BusTicketSnapshotsService],
})
export class BusTicketSnapshotsModule {}
