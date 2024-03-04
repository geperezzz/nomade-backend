import { createZodDto } from 'nestjs-zod';
import { hotelPerNightSchema } from './hotel-per-night.dto';
import { z } from 'nestjs-zod/z';

export const createHotelPerNightSchema = hotelPerNightSchema
  .innerType()
  .extend({
    id: z.string().uuid().optional(),
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
