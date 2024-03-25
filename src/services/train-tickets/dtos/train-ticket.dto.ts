import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  TrainSeatType,
  TrainTicketEntity,
} from '../entities/train-ticket.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const trainTicketOnlySchema = z.object({
  arrivalLocation: z.string(),
  arrivalTimestamp: z.coerce.date(),
  trainOperatingCompany: z.string(),
  assignedCabinType: z.nativeEnum(TrainSeatType),
});

export const trainTicketSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(trainTicketOnlySchema)
  .refine(
    (trainTicket) =>
      trainTicket.arrivalTimestamp > trainTicket.serviceTimestamp,
    {
      message:
        'The train arrival timestamp must follow the service timestamp (train departure timestamp)',
      path: ['arrivalTimestamp'],
    },
  );

export class TrainTicketDto extends createZodDto(trainTicketSchema) {
  static fromEntity(entity: TrainTicketEntity): TrainTicketDto {
    return trainTicketSchema.parse(convertDecimalsToNumbers(entity));
  }
}
