import { Module, forwardRef } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
