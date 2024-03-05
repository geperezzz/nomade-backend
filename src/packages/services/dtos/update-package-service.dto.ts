import { createZodDto } from 'nestjs-zod';

import { createPackageServiceSchema } from './create-package-service.dto';

export const updatePackageServiceSchema = createPackageServiceSchema.partial()

export class UpdatePackageServiceDto extends createZodDto(updatePackageServiceSchema) {}