import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';
import { ServicesService } from './services.service';
import { PackagesModule } from 'src/packages/packages.module';
import { ServicesController } from './services.controller';

@Module({
  imports: [forwardRef(() => HotelsPerNightModule), PackagesModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
