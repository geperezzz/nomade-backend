import { createZodDto } from 'nestjs-zod';
import { serviceSchema } from './service.dto';

export const createServiceSchema = serviceSchema
  .extend({
    id: serviceSchema.shape.id.optional(),
  });

export class CreateServiceDto extends createZodDto(
  createServiceSchema,
) {}
