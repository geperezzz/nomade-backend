import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { employeeSchema } from 'src/staff/dtos/employee.dto';

export const loginOutputSchema = z.object({
  token: z.string(),
  employee: employeeSchema,
});

export class LoginOutputDto extends createZodDto(loginOutputSchema) {}
