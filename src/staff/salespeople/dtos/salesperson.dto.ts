import { createZodDto } from 'nestjs-zod';

import { employeeSchema } from 'src/staff/dtos/employee.dto';
import { SalespersonEntity } from '../entities/salesperson.entity';

export const salespersonSchema = employeeSchema;

export class SalespersonDto extends createZodDto(salespersonSchema) {
  static fromEntity(entity: SalespersonEntity): SalespersonDto {
    return salespersonSchema.parse(entity);
  }
}
