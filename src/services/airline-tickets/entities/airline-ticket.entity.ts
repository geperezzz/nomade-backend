import {
  Service as ServiceModel,
  AirplaneCabinType as PrismaAirplaneCabinType,
  AirlineTicket as AirlineTicketModel,
} from '@prisma/client';

export type AirlineTicketEntity = Omit<
  ServiceModel,
  'id' | 'serviceType'
> &
  AirlineTicketModel;

export type AirplaneCabinType = PrismaAirplaneCabinType;
export const AirplaneCabinType = PrismaAirplaneCabinType;
