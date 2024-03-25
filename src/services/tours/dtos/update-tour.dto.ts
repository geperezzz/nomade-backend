import { createZodDto } from 'nestjs-zod';

import { createTourOnlySchema, createTourSchema } from './create-tour.dto';

export const updateTourOnlySchema = createTourOnlySchema.partial();

export const updateTourSchema = createTourSchema
  .innerType()
  .partial()
  .refine(
    (tour) => {
      if (
        tour.endOfTourTimestamp === undefined ||
        tour.serviceTimestamp === undefined
      ) {
        return true;
      }
      return tour.endOfTourTimestamp > tour.serviceTimestamp;
    },
    {
      message:
        'The end of the tour timestamp must follow the service timestamp (start of the tour timestamp)',
      path: ['endOfTourTimestamp'],
    },
  );

export class UpdateTourDto extends createZodDto(updateTourSchema) {}
