import { Module } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';

@Module({
  imports: [HotelsPerNightModule],
  controllers: [],
  providers: [],
})
export class ServicesModule {}
