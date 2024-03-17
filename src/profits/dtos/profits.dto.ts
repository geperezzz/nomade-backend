import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ProfitsEntity } from '../entities/profits.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';

export const profitsSchema = z
  .object({
    profits: z.number().nonnegative(),
  });

export class ProfitsDto extends createZodDto(profitsSchema) {
  static fromEntity(entity: ProfitsEntity): ProfitsDto {
    return profitsSchema.parse(convertDecimalsToNumbers(entity));
  }
}
