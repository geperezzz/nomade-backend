import { Service as ServiceModel, Tour as TourModel } from '@prisma/client';

export type TourEntity = Omit<ServiceModel, 'id' | 'serviceType'> & TourModel;
