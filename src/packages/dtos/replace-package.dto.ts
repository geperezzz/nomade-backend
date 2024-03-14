import { createZodDto } from 'nestjs-zod';

import { createPackageSchema } from './create-package.dto';

export const replacePackageSchema = createPackageSchema;

export class ReplacePackageDto extends createZodDto(replacePackageSchema) {}
