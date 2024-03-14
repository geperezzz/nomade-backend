import { createZodDto } from 'nestjs-zod';
import { orderPackageSchema } from './order-package.dto';
import { packageSchema } from 'src/packages/dtos/package.dto';

export const createOrderPackageSchema = orderPackageSchema
  .extend({
    packageId: packageSchema.shape.id,
    packageSnapshotId: orderPackageSchema.shape.packageSnapshotId.optional(),
  });

export class CreateOrderPackageDto extends createZodDto(createOrderPackageSchema) {}
