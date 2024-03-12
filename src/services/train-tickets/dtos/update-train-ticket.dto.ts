import { createZodDto } from 'nestjs-zod';

import {
  createTrainTicketOnlySchema,
  createTrainTicketSchema,
} from './create-train-ticket.dto';

export const updateTrainTicketOnlySchema =
  createTrainTicketOnlySchema.partial();

export const updateTrainTicketSchema = createTrainTicketSchema
  .innerType()
  .partial()
  .refine(
    (trainTicket) => {
      if (
        trainTicket.arrivalTimestamp === undefined ||
        trainTicket.serviceTimestamp === undefined
      ) {
        return true;
      }
      return trainTicket.arrivalTimestamp > trainTicket.serviceTimestamp;
    },
    {
      message:
        'The train arrival timestamp must follow the service timestamp (train departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class UpdateTrainTicketDto extends createZodDto(
  updateTrainTicketSchema,
) {}
