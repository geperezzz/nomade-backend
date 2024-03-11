import { createZodDto } from 'nestjs-zod';

import {
  carRentalOnlySchema,
  carRentalSchema,
} from './car-rental.dto';

export const createCarRentalOnlySchema = carRentalOnlySchema;

export const createCarRentalSchema = carRentalSchema
  .innerType()
  .extend({
    id: carRentalSchema.innerType().shape.id.optional(),
  })
  .refine(
    (carRental) =>
      carRental.carReturnTimestamp > carRental.serviceTimestamp,
    {
      message:
        'The car return timestamp must follow the service timestamp (car rental timestamp)',
      path: ['carReturnTimestamp'],
    },
  );

export class CreateCarRentalDto extends createZodDto(
  createCarRentalSchema,
) {}
