import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { serviceSchema } from 'src/services/schemas/service.schema';

const serviceWithOptionalIdSchema = serviceSchema
  .partial()
  .pick({ id: true })
  .merge(serviceSchema.omit({ id: true }));

export const createHotelPerNightSchema = serviceWithOptionalIdSchema
  .extend({
    numberOfNights: z.coerce.number().int().positive(),
    numberOfStars: z.coerce.number().int().positive().max(5),
    numberOfRooms: z.coerce.number().int().positive(),
    allowedNumberOfPeoplePerRoom: z.coerce.number().int().positive(),
    checkoutTimestamp: z.coerce.date(),
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
