import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightService } from './hotels-per-night.service';
import { HotelsPerNightController } from './hotels-per-night.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [HotelsPerNightController],
  providers: [HotelsPerNightService],
  exports: [HotelsPerNightService],
})
export class HotelsPerNightModule {}
