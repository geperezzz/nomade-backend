import { createZodDto } from 'nestjs-zod';

import {
  createBusTicketOnlySchema,
  createBusTicketSchema,
} from './create-bus-ticket.dto';

export const updateBusTicketOnlySchema = createBusTicketOnlySchema.partial();

export const updateBusTicketSchema = createBusTicketSchema
  .innerType()
  .partial()
  .refine(
    (busTicket) => {
      if (
        busTicket.arrivalTimestamp === undefined ||
        busTicket.serviceTimestamp === undefined
      ) {
        return true;
      }
      return busTicket.arrivalTimestamp > busTicket.serviceTimestamp;
    },
    {
      message:
        'The bus arrival timestamp must follow the service timestamp (bus departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class UpdateBusTicketDto extends createZodDto(updateBusTicketSchema) {}
