import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ProfitsEntity } from '../entities/profits.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const profitsSchema = z
  .object({
    profits: z.number().nonnegative(),
    numberOfPaidOrders: z.number().nonnegative(),
    bestSellingServices: z.array(
      z.object({
        serviceId: serviceSchema.shape.id,
        numberOfSales: z.number().nonnegative(),
      })
    ),
  });

export class ProfitsDto extends createZodDto(profitsSchema) {
  static fromEntity(entity: ProfitsEntity): ProfitsDto {
    return profitsSchema.parse(convertDecimalsToNumbers(entity));
  }
}
