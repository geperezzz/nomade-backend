import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { StaffOccupation } from 'src/staff/entities/employee.entity';
import { StaffOccupationEntity } from '../entities/staff-occupation.entity';

export const staffOccupationSchema = z.object({
  name: z.nativeEnum(StaffOccupation),
});

export class StaffOccupationDto extends createZodDto(staffOccupationSchema) {
  static fromEntity(entity: StaffOccupationEntity) {
    return staffOccupationSchema.parse(entity);
  }
}