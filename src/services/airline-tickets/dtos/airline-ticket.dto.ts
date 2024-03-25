import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  AirplaneCabinType,
  AirlineTicketEntity,
} from '../entities/airline-ticket.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const airlineTicketOnlySchema = z.object({
  arrivalLocation: z.string(),
  arrivalTimestamp: z.coerce.date(),
  airline: z.string(),
  assignedCabinType: z.nativeEnum(AirplaneCabinType),
  hasStopover: z.coerce.boolean(),
});

export const airlineTicketSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(airlineTicketOnlySchema)
  .refine(
    (airlineTicket) =>
      airlineTicket.arrivalTimestamp > airlineTicket.serviceTimestamp,
    {
      message:
        'The airplane arrival timestamp must follow the service timestamp (airplane departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class AirlineTicketDto extends createZodDto(airlineTicketSchema) {
  static fromEntity(entity: AirlineTicketEntity): AirlineTicketDto {
    return airlineTicketSchema.parse(convertDecimalsToNumbers(entity));
  }
}
