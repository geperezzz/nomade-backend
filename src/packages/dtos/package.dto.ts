import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { createPackageSchema } from './create-package.dto';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { PackageEntity } from '../entities/package.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';

export const packageSchema = createPackageSchema.required().extend({
  price: z.coerce.number().nonnegative().finite(),
  containedServices: z.array(
    z.object({
      serviceId: serviceSchema.shape.id,
      amountContained: z.number().int().positive(),
    }),
  ), // Make containedServices required, don't assume that undefined means that the package has no services
});

export class PackageDto extends createZodDto(packageSchema) {
  static fromEntity(entity: PackageEntity): PackageDto {
    return packageSchema.parse(convertDecimalsToNumbers(entity));
  }
}
