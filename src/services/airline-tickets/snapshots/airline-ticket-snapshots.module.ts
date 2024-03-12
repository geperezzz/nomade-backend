import { Module } from '@nestjs/common';

import { AirlineTicketSnapshotsService } from './airline-ticket-snapshots.service';
import { AirlineTicketsModule } from '../airline-tickets.module';

@Module({
  imports: [AirlineTicketsModule],
  providers: [AirlineTicketSnapshotsService],
  exports: [AirlineTicketSnapshotsService],
})
export class AirlineTicketSnapshotsModule {}
