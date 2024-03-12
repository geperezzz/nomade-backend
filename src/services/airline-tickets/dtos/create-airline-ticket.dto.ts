import { createZodDto } from 'nestjs-zod';

import {
  airlineTicketOnlySchema,
  airlineTicketSchema,
} from './airline-ticket.dto';

export const createAirlineTicketOnlySchema = airlineTicketOnlySchema;

export const createAirlineTicketSchema = airlineTicketSchema
  .innerType()
  .extend({
    id: airlineTicketSchema.innerType().shape.id.optional(),
  })
  .refine(
    (airlineTicket) =>
      airlineTicket.arrivalTimestamp > airlineTicket.serviceTimestamp,
    {
      message:
        'The airplane arrival timestamp must follow the service timestamp (airplane departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class CreateAirlineTicketDto extends createZodDto(
  createAirlineTicketSchema,
) {}
