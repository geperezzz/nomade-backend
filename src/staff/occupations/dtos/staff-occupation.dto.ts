import { z } from 'nestjs-zod/z';

import { StaffOccupationEntity } from '../entities/staff-occupation.entity';
import { salespersonOccupationSchema } from '../salesperson/schemas/salesperson-occupation.schema';
import { superAdminOccupationSchema } from '../superadmin/schemas/super-admin-occupation.schema';
import { adminOccupationSchema } from '../admin/schemas/admin-occupation.schema';

export const staffOccupationSchema = z.discriminatedUnion('occupationName', [
  superAdminOccupationSchema,
  adminOccupationSchema,
  salespersonOccupationSchema,
]);

export type StaffOccupationDto = z.infer<typeof staffOccupationSchema>;

export const StaffOccupationDto = {
  fromEntity(entity: StaffOccupationEntity) {
    return staffOccupationSchema.parse(entity);
  }
}