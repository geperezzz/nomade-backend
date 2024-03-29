import { CarEngineType } from 'src/services/car-rentals/entities/car-rental.entity';

export const carRentalsToSeed = [
  {
    id: '366dcfab-03ab-402f-88bd-a4903d6ed410',
    serviceName: 'Toyota Corolla 2023 rental',
    serviceDescription: 'Rent a Toyota Corolla 2023 for a week',
    serviceLocation: 'Puerto Ordaz, Venezuela',
    servicePrice: 350,
    serviceTimestamp: new Date('2024-03-28T08:00:00-04:00'),
    carReturnTimestamp: new Date('2024-04-04T08:00:00-04:00'),
    carBrand: 'Toyota',
    carModel: 'Corolla 2023',
    numberOfSeatsInTheCar: 4,
    carEngineType: CarEngineType.GASOLINE,
  },
  {
    id: '79db1bcf-df2c-478b-8335-dcad5d185136',
    serviceName: 'Honda Civic 2023 rental',
    serviceDescription: 'Rent a Honda Civic 2023 for a week',
    serviceLocation: 'Los Angeles, USA',
    servicePrice: 400,
    serviceTimestamp: new Date('2024-04-01T08:00:00-07:00'),
    carReturnTimestamp: new Date('2024-04-08T08:00:00-07:00'),
    carBrand: 'Honda',
    carModel: 'Civic 2023',
    numberOfSeatsInTheCar: 4,
    carEngineType: CarEngineType.GASOLINE,
  },
  {
    id: '7cace85d-6f6c-49c0-9711-063a26f7df55',
    serviceName: 'Ford Mustang 2024 rental',
    serviceDescription: 'Rent a Ford Mustang 2024 for a week',
    serviceLocation: 'New York, USA',
    servicePrice: 500,
    serviceTimestamp: new Date('2024-04-02T08:00:00-04:00'),
    carReturnTimestamp: new Date('2024-04-09T08:00:00-04:00'),
    carBrand: 'Ford',
    carModel: 'Mustang 2024',
    numberOfSeatsInTheCar: 2,
    carEngineType: CarEngineType.GASOLINE,
  },
  {
    id: 'e00259bd-a8fb-4386-b207-26459b236eac',
    serviceName: 'Chevrolet Camaro 2023 rental',
    serviceDescription: 'Rent a Chevrolet Camaro 2023 for a week',
    serviceLocation: 'Miami, USA',
    servicePrice: 600,
    serviceTimestamp: new Date('2024-04-03T08:00:00-04:00'),
    carReturnTimestamp: new Date('2024-04-10T08:00:00-04:00'),
    carBrand: 'Chevrolet',
    carModel: 'Camaro 2023',
    numberOfSeatsInTheCar: 2,
    carEngineType: CarEngineType.GASOLINE,
  },
  {
    id: '58c59fd3-9227-4e80-9ec6-f317707d4ec0',
    serviceName: 'BMW 3 Series 2023 rental',
    serviceDescription: 'Rent a BMW 3 Series 2023 for a week',
    serviceLocation: 'Berlin, Germany',
    servicePrice: 700,
    serviceTimestamp: new Date('2024-04-04T08:00:00+02:00'),
    carReturnTimestamp: new Date('2024-04-11T08:00:00+02:00'),
    carBrand: 'BMW',
    carModel: '3 Series 2023',
    numberOfSeatsInTheCar: 4,
    carEngineType: CarEngineType.GASOLINE,
  },
] as const;
