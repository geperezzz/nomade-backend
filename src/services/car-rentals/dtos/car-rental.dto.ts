import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { CarEngineType, CarRentalEntity } from '../entities/car-rental.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const carRentalOnlySchema = z.object({
  carReturnTimestamp: z.coerce.date(),
  carBrand: z.string(),
  carModel: z.string(),
  numberOfSeatsInTheCar: z.coerce.number().int().positive(),
  carEngineType: z.nativeEnum(CarEngineType),
});

export const carRentalSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(carRentalOnlySchema)
  .refine(
    (carRental) => carRental.carReturnTimestamp > carRental.serviceTimestamp,
    {
      message:
        'The car return timestamp must follow the service timestamp (car rental timestamp)',
      path: ['carReturnTimestamp'],
    },
  );

export class CarRentalDto extends createZodDto(carRentalSchema) {
  static fromEntity(entity: CarRentalEntity): CarRentalDto {
    return carRentalSchema.parse(convertDecimalsToNumbers(entity));
  }
}
