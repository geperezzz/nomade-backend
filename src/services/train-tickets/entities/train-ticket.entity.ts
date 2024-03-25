import {
  Service as ServiceModel,
  TrainTicket as TrainTicketModel,
  TrainCabinType as PrismaTrainCabinType,
} from '@prisma/client';

export type TrainTicketEntity = Omit<ServiceModel, 'id' | 'serviceType'> &
  TrainTicketModel;

export type TrainSeatType = PrismaTrainCabinType;
export const TrainSeatType = PrismaTrainCabinType;
