import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { employeeSchema } from 'src/staff/dtos/employee.dto';

export const createSalespersonSchema = z.object({
  employeeId: employeeSchema.shape.id,
});

export class CreateSalespersonDto extends createZodDto(createSalespersonSchema) {}
