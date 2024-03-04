import { createZodDto } from 'nestjs-zod';

import { createServiceSchema } from './create-service.dto';

export const updateServiceSchema = createServiceSchema
  .partial();

export class UpdateServiceDto extends createZodDto(
  updateServiceSchema,
) {}
