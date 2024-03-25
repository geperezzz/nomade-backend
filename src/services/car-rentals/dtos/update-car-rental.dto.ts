import { createZodDto } from 'nestjs-zod';

import {
  createCarRentalOnlySchema,
  createCarRentalSchema,
} from './create-car-rental.dto';

export const updateCarRentalOnlySchema = createCarRentalOnlySchema.partial();

export const updateCarRentalSchema = createCarRentalSchema
  .innerType()
  .partial()
  .refine(
    (carRental) => {
      if (
        carRental.carReturnTimestamp === undefined ||
        carRental.serviceTimestamp === undefined
      ) {
        return true;
      }
      return carRental.carReturnTimestamp > carRental.serviceTimestamp;
    },
    {
      message:
        'The car return timestamp must follow the service timestamp (car rental timestamp)',
      path: ['carReturnTimestamp'],
    },
  );

export class UpdateCarRentalDto extends createZodDto(updateCarRentalSchema) {}
