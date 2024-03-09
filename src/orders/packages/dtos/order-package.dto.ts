import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { OrderPackageEntity } from '../entities/order-package.entity';
import { packageSchema } from 'src/packages/dtos/package.dto';

export const orderPackageSchema = z.object({
  packageId: packageSchema.shape.id,
  amountOrdered: z.coerce.number().positive(),
});

export class OrderPackageDto extends createZodDto(orderPackageSchema) {
  static fromEntity(entity: OrderPackageEntity): OrderPackageDto {
    return orderPackageSchema.parse(entity);
  }
}
