import { createZodDto } from 'nestjs-zod';

import {
  hotelPerNightOnlySchema,
  hotelPerNightSchema,
} from './hotel-per-night.dto';

export const createHotelPerNightOnlySchema = hotelPerNightOnlySchema;

export const createHotelPerNightSchema = hotelPerNightSchema
  .innerType()
  .extend({
    id: hotelPerNightSchema.innerType().shape.id.optional(),
  })
  .refine(
    (hotelPerNight) =>
      hotelPerNight.checkoutTimestamp > hotelPerNight.serviceTimestamp,
    {
      message:
        'The checkout timestamp must follow the service timestamp (checkin timestamp)',
      path: ['checkoutTimestamp'],
    },
  );

export class CreateHotelPerNightDto extends createZodDto(
  createHotelPerNightSchema,
) {}
