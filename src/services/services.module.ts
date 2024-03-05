import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';
import { ServicesService } from './services.service';
import { PackagesModule } from 'src/packages/packages.module';

@Module({
  imports: [forwardRef(() => HotelsPerNightModule), PackagesModule],
  controllers: [],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
