import { BusSeatType } from 'src/services/bus-tickets/entities/bus-ticket.entity';

export const busTicketsToSeed = [
  {
    id: '79bc2d6b-b78d-4485-bfa2-23a53b7acb87',
    serviceName: 'Greyhound bus ticket to travel from Boston to New York',
    serviceDescription: 'Travel from Boston to New York with Greyhound',
    serviceLocation: 'Boston, USA',
    servicePrice: 32,
    serviceTimestamp: new Date('2024-04-30T12:00:00-04:00'),
    arrivalLocation: 'New York, USA',
    arrivalTimestamp: new Date('2024-04-30T16:00:00-04:00'),
    assignedBusSeat: '5B',
    busSeatType: BusSeatType.STANDARD,
    busOperatingCompany: 'Greyhound',
  },
  {
    id: '755e9b86-0cdc-4e2e-a62c-59ec67d5e275',
    serviceName: 'Megabus ticket to travel from Chicago to Detroit',
    serviceDescription: 'Travel from Chicago to Detroit with Megabus',
    serviceLocation: 'Chicago, USA',
    servicePrice: 25,
    serviceTimestamp: new Date('2024-05-01T09:00:00-04:00'),
    arrivalLocation: 'Detroit, USA',
    arrivalTimestamp: new Date('2024-05-01T14:00:00-04:00'),
    assignedBusSeat: '10A',
    busSeatType: BusSeatType.STANDARD,
    busOperatingCompany: 'Megabus',
  },
  {
    id: 'b4f404e9-c19a-4537-a7d8-31f9f8a286d2',
    serviceName: 'FlixBus ticket to travel from Berlin to Munich',
    serviceDescription: 'Travel from Berlin to Munich with FlixBus',
    serviceLocation: 'Berlin, Germany',
    servicePrice: 30,
    serviceTimestamp: new Date('2024-05-02T08:00:00+02:00'),
    arrivalLocation: 'Munich, Germany',
    arrivalTimestamp: new Date('2024-05-02T14:00:00+02:00'),
    assignedBusSeat: '15C',
    busSeatType: BusSeatType.SEMI_BED,
    busOperatingCompany: 'FlixBus',
  },
  {
    id: '633d396a-6276-4544-af28-fd4293d0dc88',
    serviceName: 'BoltBus ticket to travel from Vancouver to Seattle',
    serviceDescription: 'Travel from Vancouver to Seattle with BoltBus',
    serviceLocation: 'Vancouver, Canada',
    servicePrice: 35,
    serviceTimestamp: new Date('2024-05-03T10:00:00-07:00'),
    arrivalLocation: 'Seattle, USA',
    arrivalTimestamp: new Date('2024-05-03T14:00:00-07:00'),
    assignedBusSeat: '20D',
    busSeatType: BusSeatType.STANDARD,
    busOperatingCompany: 'BoltBus',
  },
  {
    id: '27f7d445-a096-4e70-baae-73e44439b14e',
    serviceName: 'Eurolines ticket to travel from Paris to Amsterdam',
    serviceDescription: 'Travel from Paris to Amsterdam with Eurolines',
    serviceLocation: 'Paris, France',
    servicePrice: 40,
    serviceTimestamp: new Date('2024-05-04T12:00:00+02:00'),
    arrivalLocation: 'Amsterdam, Netherlands',
    arrivalTimestamp: new Date('2024-05-04T18:00:00+02:00'),
    assignedBusSeat: '25E',
    busSeatType: BusSeatType.BED_EXECUTIVE,
    busOperatingCompany: 'Eurolines',
  },
] as const;
