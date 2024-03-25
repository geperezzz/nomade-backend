import { createZodDto } from 'nestjs-zod';

import { busTicketOnlySchema, busTicketSchema } from './bus-ticket.dto';

export const createBusTicketOnlySchema = busTicketOnlySchema;

export const createBusTicketSchema = busTicketSchema
  .innerType()
  .extend({
    id: busTicketSchema.innerType().shape.id.optional(),
  })
  .refine(
    (busTicket) => busTicket.arrivalTimestamp > busTicket.serviceTimestamp,
    {
      message:
        'The bus arrival timestamp must follow the service timestamp (bus departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class CreateBusTicketDto extends createZodDto(createBusTicketSchema) {}
