import {
  HotelPerNight as HotelPerNightModel,
  Service as ServiceModel,
} from '@prisma/client';

export type HotelPerNightEntity = Omit<ServiceModel, 'id' | 'serviceType'> &
  HotelPerNightModel;
