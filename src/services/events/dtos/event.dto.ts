import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { EventEntity } from '../entities/event.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const eventOnlySchema = z.object({
  eventType: z.string(),
  endOfEventTimestamp: z.coerce.date(),
});

export const eventSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(eventOnlySchema)
  .refine(
    (event) =>
      event.endOfEventTimestamp > event.serviceTimestamp,
    {
      message:
        'The end of the event timestamp must follow the service timestamp (start of the event timestamp)',
      path: ['endOfEventTimestamp'],
    },
  );

export class EventDto extends createZodDto(eventSchema) {
  static fromEntity(entity: EventEntity): EventDto {
    return eventSchema.parse(convertDecimalsToNumbers(entity));
  }
}
