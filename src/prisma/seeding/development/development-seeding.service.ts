import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SeedingConfig } from '../seeding.config';
import { Transactional } from '@nestjs-cls/transactional';
import { StaffService } from 'src/staff/staff.service';
import { StaffOccupationsService } from 'src/staff/staff-occupations/staff-occupations.service';
import { staffToSeed } from './seeding-data/staff-to-seed';
import { CustomersService } from 'src/customers/customers.service';
import { customersToSeed } from './seeding-data/customers-to-seed';
import { HotelsPerNightService } from 'src/services/hotels-per-night/hotels-per-night.service';
import { hotelsPerNightToSeed } from './seeding-data/hotels-per-night-to-seed';
import { AirlineTicketsService } from 'src/services/airline-tickets/airline-tickets.service';
import { airlineTicketsToSeed } from './seeding-data/airline-tickets-to-seed';
import { BusTicketsService } from 'src/services/bus-tickets/bus-tickets.service';
import { CarRentalsService } from 'src/services/car-rentals/car-rentals.service';
import { EventsService } from 'src/services/events/events.service';
import { ToursService } from 'src/services/tours/tours.service';
import { TrainTicketsService } from 'src/services/train-tickets/train-tickets.service';
import { busTicketsToSeed } from './seeding-data/bus-tickets-to-seed';
import { carRentalsToSeed } from './seeding-data/car-rentals-to-seed';
import { eventsToSeed } from './seeding-data/events-to-seed';
import { toursToSeed } from './seeding-data/tours-to-seed';
import { trainTicketsToSeed } from './seeding-data/train-tickets-to-seed';
import { PackagesService } from 'src/packages/packages.service';
import { packagesToSeed } from './seeding-data/packages-to-seed';
import { PaymentMethodsService } from 'src/payment-methods/payment-methods.service';
import { paymentMethodsToSeed } from './seeding-data/payment-methods-to-seed';
import { OrdersService } from 'src/orders/orders.service';
import { ordersToSeed } from './seeding-data/orders-to-seed';

@Injectable()
export class DevelopmentSeedingService {
  constructor(
    private staffService: StaffService,
    private staffOccupationsService: StaffOccupationsService,
    private customersService: CustomersService,
    private airlineTicketsService: AirlineTicketsService,
    private busTicketsService: BusTicketsService,
    private carRentalsService: CarRentalsService,
    private eventsService: EventsService,
    private hotelsPerNightService: HotelsPerNightService,
    private toursService: ToursService,
    private trainTicketsService: TrainTicketsService,
    private packagesService: PackagesService,
    private paymentMethodsService: PaymentMethodsService,
    private ordersService: OrdersService,
  ) {}

  @Transactional()
  async seed(_configService: ConfigService<SeedingConfig, true>): Promise<void> {
    await Promise.all([
      this.seedStaff(),
      this.seedCustomers(),
      this.seedServices(),
      this.seedPaymentMethods(),
    ]);
    await this.seedPackages();
    await this.seedOrders();
  }

  @Transactional()
  private async seedStaff(): Promise<void> {
    await Promise.all(
      staffToSeed.map(async ({ occupations, ...employee }) => {
        const seededEmployee = await this.staffService.create(employee);

        await Promise.all(
          occupations.map(async occupation => {
            return await this.staffOccupationsService.create(
              seededEmployee.id,
              occupation,
            );
          }),
        );
      })
    );
  }

  @Transactional()
  private async seedCustomers(): Promise<void> {
    await Promise.all(
      customersToSeed.map(async customer => {
        await this.customersService.create(customer);
      })
    );
  }

  @Transactional()
  private async seedServices(): Promise<void> {
    await Promise.all([
      this.seedAirlineTickets(),
      this.seedBusTickets(),
      this.seedCarRentals(),
      this.seedEvents(),
      this.seedHotelsPerNight(),
      this.seedTours(),
      this.seedTrainTickets(),
    ]);
  }
  
  @Transactional()
  private async seedAirlineTickets(): Promise<void> {
    await Promise.all(
      airlineTicketsToSeed.map(async airlineTicket => {
        await this.airlineTicketsService.create(airlineTicket);
      })
    );
  }

  @Transactional()
  private async seedBusTickets(): Promise<void> {
    await Promise.all(
      busTicketsToSeed.map(async busTicket => {
        await this.busTicketsService.create(busTicket);
      })
    );
  }

  @Transactional()
  private async seedCarRentals(): Promise<void> {
    await Promise.all(
      carRentalsToSeed.map(async carRental => {
        await this.carRentalsService.create(carRental);
      })
    );
  }

  @Transactional()
  private async seedEvents(): Promise<void> {
    await Promise.all(
      eventsToSeed.map(async event => {
        await this.eventsService.create(event);
      })
    );
  }

  @Transactional()
  private async seedHotelsPerNight(): Promise<void> {
    await Promise.all(
      hotelsPerNightToSeed.map(async hotelPerNight => {
        await this.hotelsPerNightService.create(hotelPerNight);
      })
    );
  }

  @Transactional()
  private async seedTours(): Promise<void> {
    await Promise.all(
      toursToSeed.map(async tour => {
        await this.toursService.create(tour);
      })
    );
  }

  @Transactional()
  private async seedTrainTickets(): Promise<void> {
    await Promise.all(
      trainTicketsToSeed.map(async trainTicket => {
        await this.trainTicketsService.create(trainTicket);
      })
    );
  }

  @Transactional()
  private async seedPackages(): Promise<void> {
    await Promise.all(
      packagesToSeed.map(async packageToSeed => {
        await this.packagesService.create(packageToSeed);
      })
    );
  }

  @Transactional()
  private async seedPaymentMethods(): Promise<void> {
    await Promise.all(
      paymentMethodsToSeed.map(async paymentMethod => {
        await this.paymentMethodsService.create(paymentMethod);
      })
    );
  }

  @Transactional()
  private async seedOrders(): Promise<void> {
    await Promise.all(
      ordersToSeed.map(async order => {
        await this.ordersService.create(order);
      })
    )
  }
}