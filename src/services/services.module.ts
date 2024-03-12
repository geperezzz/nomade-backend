import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';
import { ServicesService } from './services.service';
import { PackagesModule } from 'src/packages/packages.module';
import { ServicesController } from './services.controller';
import { CarRentalsModule } from './car-rentals/car-rentals.module';
import { BusTicketsModule } from './bus-tickets/bus-tickets.module';

@Module({
  imports: [
    forwardRef(() => HotelsPerNightModule),
    forwardRef(() => CarRentalsModule),
    forwardRef(() => BusTicketsModule),
    PackagesModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
