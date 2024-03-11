import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { StaffOccupationName } from 'src/staff/entities/employee.entity';
import { AvailableOccupationEntity } from '../entities/available-occupation.entity';

export const availableOccupationSchema = z.object({
  occupationName: z.nativeEnum(StaffOccupationName),
});

export class AvailableOccupationDto extends createZodDto(availableOccupationSchema) {
  static fromEntity(entity: AvailableOccupationEntity): AvailableOccupationDto {
    return availableOccupationSchema.parse(entity);
  }
}