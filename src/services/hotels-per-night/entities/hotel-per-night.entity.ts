import {
  HotelPerNight as HotelPerNightModel,
  Service as ServiceModel,
} from '@prisma/client';

// Black Magic
type RenameKeysOf<T, Mappings> = {
  [Key in keyof T as Key extends keyof Mappings
    ? Mappings[Key] extends string
      ? Mappings[Key]
      : never
    : Key]: Key extends keyof T ? T[Key] : never;
};

export type HotelPerNightEntity = Omit<
  RenameKeysOf<
    ServiceModel,
    {
      name: 'serviceName';
      description: 'serviceDescription';
      price: 'servicePrice';
    }
  >,
  'lastUpdateTimestamp' | 'serviceType'
> &
  HotelPerNightModel;
