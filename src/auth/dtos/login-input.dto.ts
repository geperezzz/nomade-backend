import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { employeeSchema } from 'src/staff/dtos/employee.dto';

export const loginInputSchema = z
  .object({
    password: z.string(),
    employeeId: employeeSchema.shape.id.optional(),
    employeeEmail: employeeSchema.shape.email.optional(),
    employeeDni: employeeSchema.shape.dni.optional(),
  })
  .refine(
    loginDto => loginDto.employeeId || loginDto.employeeEmail || loginDto.employeeDni,
    {
      message: 'At least one of the following fields must be provided: `employeeId`, `employeeEmail`, `employeeDni`',
      path: ['employeeId', 'employeeEmail', 'employeeDni'],
    }
  );

export class LoginInputDto extends createZodDto(loginInputSchema) {};