import { Event as EventModel, Service as ServiceModel } from '@prisma/client';

export type EventEntity = Omit<ServiceModel, 'id' | 'serviceType'> & EventModel;
