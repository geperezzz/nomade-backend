import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { serviceSchema } from 'src/services/dtos/service.dto';

export const createPackageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  appliedDiscountPercentage: z.coerce.number().min(0).max(100),
  containedServices: z
    .array(
      z.object({
        serviceId: serviceSchema.shape.id,
        amountContained: z.number().int().positive(),
      }),
    )
    .default(Array),
});

export class CreatePackageDto extends createZodDto(createPackageSchema) {}
