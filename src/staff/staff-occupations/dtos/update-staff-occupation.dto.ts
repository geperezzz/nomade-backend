import { z } from 'nestjs-zod/z';

import { updateSalespersonOccupationSchema } from '../salesperson/schemas/update-salesperson-occupation.schema';
import { updateSuperAdminOccupationSchema } from '../superadmin/schemas/update-super-admin-occupation.schema';
import { updateAdminOccupationSchema } from '../admin/schemas/update-admin-occupation.schema';

export const updateStaffOccupationSchema = updateSuperAdminOccupationSchema
  .or(updateSalespersonOccupationSchema)
  .or(updateAdminOccupationSchema);

export type UpdateStaffOccupationDto = z.infer<typeof updateStaffOccupationSchema>;