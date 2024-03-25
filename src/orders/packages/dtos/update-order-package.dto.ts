import { createZodDto } from 'nestjs-zod';

import { createOrderPackageSchema } from './create-order-package.dto';

export const updateOrderPackageSchema = createOrderPackageSchema.partial();

export class UpdateOrderPackageDto extends createZodDto(
  updateOrderPackageSchema,
) {}
