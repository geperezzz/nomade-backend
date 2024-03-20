import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { OrderPackageEntity } from '../entities/order-package.entity';
import { packageSchema } from 'src/packages/dtos/package.dto';
import { packageServiceSchema } from 'src/packages/services/dtos/package-service.dto';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const orderPackageSchema = z.object({
  packageId: packageSchema.shape.id.optional(),
  packageSnapshot: packageSchema.extend({
    containedServices: z.array(
      packageServiceSchema
        .omit({ service: true })
        .extend({
          serviceId: serviceSchema.shape.id.optional(),
          serviceSnapshot: serviceSchema.extend({
            snapshotTimestamp: z.coerce.date(),
          }),
        })
    ),
    snapshotTimestamp: z.coerce.date(),
  }),
  amountOrdered: z.coerce.number().positive(),
});

export class OrderPackageDto extends createZodDto(orderPackageSchema) {
  static fromEntity(entity: OrderPackageEntity): OrderPackageDto {
    return orderPackageSchema.parse(entity);
  }
}
