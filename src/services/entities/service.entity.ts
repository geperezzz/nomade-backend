import { Service as ServiceModel, ServiceType as PrismaServiceType } from '@prisma/client';

export type ServiceEntity = ServiceModel;

export const ServiceType = PrismaServiceType;