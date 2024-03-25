import {
  CarEngineType as PrismaCarEngineType,
  CarRental as CarRentalModel,
  Service as ServiceModel,
} from '@prisma/client';

export type CarRentalEntity = Omit<ServiceModel, 'id' | 'serviceType'> &
  CarRentalModel;

export type CarEngineType = PrismaCarEngineType;
export const CarEngineType = PrismaCarEngineType;
