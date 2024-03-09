import { createZodDto } from 'nestjs-zod';

import { createEmployeeSchema } from './create-employee.dto';

export const updateEmployeeSchema = createEmployeeSchema.partial();

export class UpdateEmployeeDto extends createZodDto(updateEmployeeSchema) {}
