import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { EmployeeEntity } from '../entities/employee.entity';
import { staffOccupationSchema } from '../staff-occupations/dtos/staff-occupation.dto';

export const employeeSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  dni: z.string(),
  birthdate: z.coerce.date(),
  citizenship: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  salary: z.coerce.number().nonnegative().finite(),
  occupations: z.array(staffOccupationSchema),
});

export class EmployeeDto extends createZodDto(employeeSchema) {
  static fromEntity(entity: EmployeeEntity): EmployeeDto {
    return employeeSchema.parse(entity);
  }
}
