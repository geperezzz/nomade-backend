import { createZodDto } from 'nestjs-zod';

import { createHotelPerNightSchema } from './create-hotel-per-night.dto';

export const updateHotelPerNightSchema = createHotelPerNightSchema
  .innerType()
  .partial()
  .refine(
    (hotelPerNight) => {
      if (
        hotelPerNight.checkoutTimestamp === undefined ||
        hotelPerNight.serviceTimestamp === undefined
      ) {
        return true;
      }
      return hotelPerNight.checkoutTimestamp > hotelPerNight.serviceTimestamp;
    },
    {
      message:
        'The checkout timestamp must follow the service timestamp (checkin timestamp)',
      path: ['checkoutTimestamp'],
    },
  );

export class UpdateHotelPerNightDto extends createZodDto(
  updateHotelPerNightSchema,
) {}
