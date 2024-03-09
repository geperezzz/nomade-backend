import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { createPackageServiceSchema } from '../services/dtos/create-package-service.dto';

export const createPackageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  appliedDiscountPercentage: z.coerce.number().min(0).max(100),
  containedServices: z
    .array(createPackageServiceSchema)
    .default(Array),
});

export class CreatePackageDto extends createZodDto(createPackageSchema) {}
