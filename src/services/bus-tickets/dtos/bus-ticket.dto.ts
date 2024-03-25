import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { BusSeatType, BusTicketEntity } from '../entities/bus-ticket.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const busTicketOnlySchema = z.object({
  arrivalLocation: z.string(),
  arrivalTimestamp: z.coerce.date(),
  assignedBusSeat: z.string(),
  busSeatType: z.nativeEnum(BusSeatType),
  busOperatingCompany: z.string(),
});

export const busTicketSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(busTicketOnlySchema)
  .refine(
    (busTicket) => busTicket.arrivalTimestamp > busTicket.serviceTimestamp,
    {
      message:
        'The bus arrival timestamp must follow the service timestamp (bus departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class BusTicketDto extends createZodDto(busTicketSchema) {
  static fromEntity(entity: BusTicketEntity): BusTicketDto {
    return busTicketSchema.parse(convertDecimalsToNumbers(entity));
  }
}
