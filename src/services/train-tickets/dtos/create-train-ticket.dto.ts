import { createZodDto } from 'nestjs-zod';

import { trainTicketOnlySchema, trainTicketSchema } from './train-ticket.dto';

export const createTrainTicketOnlySchema = trainTicketOnlySchema;

export const createTrainTicketSchema = trainTicketSchema
  .innerType()
  .extend({
    id: trainTicketSchema.innerType().shape.id.optional(),
  })
  .refine(
    (trainTicket) =>
      trainTicket.arrivalTimestamp > trainTicket.serviceTimestamp,
    {
      message:
        'The train arrival timestamp must follow the service timestamp (train departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class CreateTrainTicketDto extends createZodDto(
  createTrainTicketSchema,
) {}
