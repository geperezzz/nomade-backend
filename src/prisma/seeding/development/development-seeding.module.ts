import { Module } from '@nestjs/common';

import { DevelopmentSeedingService } from './development-seeding.service';
import { StaffModule } from 'src/staff/staff.module';
import { StaffOccupationsModule } from 'src/staff/staff-occupations/staff-occupations.module';
import { CustomersModule } from 'src/customers/customers.module';
import { HotelsPerNightModule } from 'src/services/hotels-per-night/hotels-per-night.module';
import { AirlineTicketsModule } from 'src/services/airline-tickets/airline-tickets.module';
import { BusTicketsModule } from 'src/services/bus-tickets/bus-tickets.module';
import { CarRentalsModule } from 'src/services/car-rentals/car-rentals.module';
import { EventsModule } from 'src/services/events/events.module';
import { ToursModule } from 'src/services/tours/tours.module';
import { TrainTicketsModule } from 'src/services/train-tickets/train-tickets.module';
import { PackagesModule } from 'src/packages/packages.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';
import { OrdersModule } from 'src/orders/orders.module';
import { OrderPaymentsModule } from 'src/orders/payments/order-payments.module';

@Module({
  imports: [
    StaffModule,
    StaffOccupationsModule,
    CustomersModule,
    AirlineTicketsModule,
    BusTicketsModule,
    CarRentalsModule,
    EventsModule,
    HotelsPerNightModule,
    ToursModule,
    TrainTicketsModule,
    PackagesModule,
    PaymentMethodsModule,
    OrdersModule,
    OrderPaymentsModule,
  ],
  providers: [DevelopmentSeedingService],
  exports: [DevelopmentSeedingService],
})
export class DevelopmentSeedingModule {}
