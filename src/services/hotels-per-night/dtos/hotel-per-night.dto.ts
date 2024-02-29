import { createZodDto } from 'nestjs-zod';

import { createHotelPerNightSchema } from './create-hotel-per-night.dto';

export const hotelPerNightSchema = createHotelPerNightSchema
  .innerType()
  .required()
  .refine(
    (hotelPerNight) =>
      hotelPerNight.checkoutTimestamp > hotelPerNight.serviceTimestamp,
    {
      message:
        'The checkout timestamp must follow the service timestamp (checkin timestamp)',
      path: ['checkoutTimestamp'],
    },
  );

export class HotelPerNightDto extends createZodDto(hotelPerNightSchema) {}
