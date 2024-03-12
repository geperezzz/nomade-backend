import { Module, forwardRef } from '@nestjs/common';

import { TrainTicketsService } from './train-tickets.service';
import { TrainTicketsController } from './bus-tickets.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [TrainTicketsController],
  providers: [TrainTicketsService],
  exports: [TrainTicketsService],
})
export class TrainTicketsModule {}
