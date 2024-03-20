import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { employeeSchema } from './employee.dto';

export const createEmployeeSchema = employeeSchema
  .omit({ occupations: true })
  .extend({
    id: employeeSchema.shape.id.optional(),
    password: z.string(),
  });

export class CreateEmployeeDto extends createZodDto(createEmployeeSchema) {}
