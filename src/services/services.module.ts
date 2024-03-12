import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';
import { ServicesService } from './services.service';
import { PackagesModule } from 'src/packages/packages.module';
import { ServicesController } from './services.controller';
import { CarRentalsModule } from './car-rentals/car-rentals.module';
import { BusTicketsModule } from './bus-tickets/bus-tickets.module';
import { AirlineTicketsModule } from './airline-tickets/airline-tickets.module';
import { ToursModule } from './tours/tours.module';
import { TrainTicketsModule } from './train-tickets/train-tickets.module';

@Module({
  imports: [
    forwardRef(() => HotelsPerNightModule),
    forwardRef(() => CarRentalsModule),
    forwardRef(() => BusTicketsModule),
    forwardRef(() => AirlineTicketsModule),
    forwardRef(() => TrainTicketsModule),
    forwardRef(() => ToursModule),
    PackagesModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
