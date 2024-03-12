import { Module, forwardRef } from '@nestjs/common';

import { BusTicketsService } from './bus-tickets.service';
import { BusTicketsController } from './bus-tickets.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [BusTicketsController],
  providers: [BusTicketsService],
  exports: [BusTicketsService],
})
export class BusTicketsModule {}
