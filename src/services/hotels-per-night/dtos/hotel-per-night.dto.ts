import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { HotelPerNightEntity } from '../entities/hotel-per-night.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const hotelPerNightOnlySchema = z.object({
  numberOfNights: z.coerce.number().int().positive(),
  numberOfStars: z.coerce.number().int().positive().max(5),
  numberOfRooms: z.coerce.number().int().positive(),
  allowedNumberOfPeoplePerRoom: z.coerce.number().int().positive(),
  checkoutTimestamp: z.coerce.date(),
});

export const hotelPerNightSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(hotelPerNightOnlySchema)
  .refine(
    (hotelPerNight) =>
      hotelPerNight.checkoutTimestamp > hotelPerNight.serviceTimestamp,
    {
      message:
        'The checkout timestamp must follow the service timestamp (checkin timestamp)',
      path: ['checkoutTimestamp'],
    },
  );

export class HotelPerNightDto extends createZodDto(hotelPerNightSchema) {
  static fromEntity(entity: HotelPerNightEntity): HotelPerNightDto {
    return hotelPerNightSchema.parse(convertDecimalsToNumbers(entity));
  }
}
