import { createZodDto } from 'nestjs-zod';

import { packageServiceSchema } from './package-service.dto';

export const createPackageServiceSchema = packageServiceSchema
  .omit({ packageId: true})

export class CreatePackageServiceDto extends createZodDto(createPackageServiceSchema) {}
