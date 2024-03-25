import { createZodDto } from 'nestjs-zod';

import { packageServiceSchema } from './package-service.dto';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const createPackageServiceSchema = packageServiceSchema.extend({
  service: serviceSchema.pick({ id: true }),
});

export class CreatePackageServiceDto extends createZodDto(
  createPackageServiceSchema,
) {}
