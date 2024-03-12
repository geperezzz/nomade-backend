import { createZodDto } from 'nestjs-zod';

import {
  eventOnlySchema,
  eventSchema,
} from './event.dto';

export const createEventOnlySchema = eventOnlySchema;

export const createEventSchema = eventSchema
  .innerType()
  .extend({
    id: eventSchema.innerType().shape.id.optional(),
  })
  .refine(
    (event) =>
      event.endOfEventTimestamp > event.serviceTimestamp,
    {
      message:
        'The end of the event timestamp must follow the service timestamp (start of the event timestamp)',
      path: ['endOfEventTimestamp'],
    },
  );

export class CreateEventDto extends createZodDto(
  createEventSchema,
) {}
