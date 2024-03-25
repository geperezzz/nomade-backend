import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { PackageEntity } from '../entities/package.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { packageServiceSchema } from '../services/dtos/package-service.dto';

export const packageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number().nonnegative().finite(),
  appliedDiscountPercentage: z.coerce.number().min(0).max(100),
  containedServices: z.array(packageServiceSchema),
});

export class PackageDto extends createZodDto(packageSchema) {
  static fromEntity(entity: PackageEntity): PackageDto {
    return packageSchema.parse(convertDecimalsToNumbers(entity));
  }
}
