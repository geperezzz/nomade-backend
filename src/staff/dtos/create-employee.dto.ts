import { createZodDto } from 'nestjs-zod';

import { employeeSchema } from './employee.dto';

export const createEmployeeSchema = employeeSchema
  .omit({ occupations: true })
  .extend({ id: employeeSchema.shape.id.optional() });

export class CreateEmployeeDto extends createZodDto(createEmployeeSchema) {}
