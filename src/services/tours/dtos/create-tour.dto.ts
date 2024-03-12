import { createZodDto } from 'nestjs-zod';

import {
  tourOnlySchema,
  tourSchema,
} from './tour.dto';

export const createTourOnlySchema = tourOnlySchema;

export const createTourSchema = tourSchema
  .innerType()
  .extend({
    id: tourSchema.innerType().shape.id.optional(),
  })
  .refine(
    (tour) =>
      tour.endOfTourTimestamp > tour.serviceTimestamp,
    {
      message:
        'The end of the tour timestamp must follow the service timestamp (start of the tour timestamp)',
      path: ['endOfTourTimestamp'],
    },
  );

export class CreateTourDto extends createZodDto(
  createTourSchema,
) {}
