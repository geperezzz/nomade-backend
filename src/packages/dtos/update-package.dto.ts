import { createZodDto } from 'nestjs-zod';

import { createPackageSchema } from './create-package.dto';

export const updatePackageSchema = createPackageSchema
  .partial()
  .omit({ containedServices: true });

export class UpdatePackageDto extends createZodDto(updatePackageSchema) {}
