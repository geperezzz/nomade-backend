import { createZodDto } from 'nestjs-zod';

import { packageServiceSchema } from './package-service.dto';

export const createPackageServiceSchema = packageServiceSchema;

export class CreatePackageServiceDto extends createZodDto(
  createPackageServiceSchema,
) {}
