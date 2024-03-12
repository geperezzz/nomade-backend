import {
  Service as ServiceModel,
  BusTicket as BusTicketModel,
  BusSeatType as PrismaBusSeatType,
} from '@prisma/client';

export type BusTicketEntity = Omit<
  ServiceModel,
  'id' | 'serviceType'
> &
  BusTicketModel;

export type BusSeatType = PrismaBusSeatType;
export const BusSeatType = PrismaBusSeatType;
