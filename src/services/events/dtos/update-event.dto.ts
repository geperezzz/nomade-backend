import { createZodDto } from 'nestjs-zod';

import { createEventOnlySchema, createEventSchema } from './create-event.dto';

export const updateEventOnlySchema = createEventOnlySchema.partial();

export const updateEventSchema = createEventSchema
  .innerType()
  .partial()
  .refine(
    (event) => {
      if (
        event.endOfEventTimestamp === undefined ||
        event.serviceTimestamp === undefined
      ) {
        return true;
      }
      return event.endOfEventTimestamp > event.serviceTimestamp;
    },
    {
      message:
        'The end of the event timestamp must follow the service timestamp (start of the event timestamp)',
      path: ['endOfEventTimestamp'],
    },
  );

export class UpdateEventDto extends createZodDto(updateEventSchema) {}
