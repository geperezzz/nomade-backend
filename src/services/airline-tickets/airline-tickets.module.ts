import { Module, forwardRef } from '@nestjs/common';

import { AirlineTicketsService } from './airline-tickets.service';
import { AirlineTicketsController } from './airline-tickets.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [AirlineTicketsController],
  providers: [AirlineTicketsService],
  exports: [AirlineTicketsService],
})
export class AirlineTicketsModule {}
