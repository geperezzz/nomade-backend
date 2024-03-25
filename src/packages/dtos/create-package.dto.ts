import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { createPackageServiceSchema } from '../services/dtos/create-package-service.dto';
import { packageSchema } from './package.dto';

export const createPackageSchema = packageSchema.omit({ price: true }).extend({
  id: packageSchema.shape.id.optional(),
  containedServices: z.array(createPackageServiceSchema).default(Array),
});

export class CreatePackageDto extends createZodDto(createPackageSchema) {}
