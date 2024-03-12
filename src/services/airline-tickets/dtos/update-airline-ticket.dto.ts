import { createZodDto } from 'nestjs-zod';

import {
  createAirlineTicketOnlySchema,
  createAirlineTicketSchema,
} from './create-airline-ticket.dto';

export const updateAirlineTicketOnlySchema =
  createAirlineTicketOnlySchema.partial();

export const updateAirlineTicketSchema = createAirlineTicketSchema
  .innerType()
  .partial()
  .refine(
    (airlineTicket) => {
      if (
        airlineTicket.arrivalTimestamp === undefined ||
        airlineTicket.serviceTimestamp === undefined
      ) {
        return true;
      }
      return airlineTicket.arrivalTimestamp > airlineTicket.serviceTimestamp;
    },
    {
      message:
        'The airplane arrival timestamp must follow the service timestamp (airplane departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class UpdateAirlineTicketDto extends createZodDto(
  updateAirlineTicketSchema,
) {}
