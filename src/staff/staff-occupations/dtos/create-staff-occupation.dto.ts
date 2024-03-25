import { z } from 'nestjs-zod/z';

import { createSalespersonOccupationSchema } from '../salesperson/schemas/create-salesperson-occupation.schema';
import { createSuperAdminOccupationSchema } from '../superadmin/schemas/create-super-admin-occupation.schema';
import { createAdminOccupationSchema } from '../admin/schemas/create-admin-occupation.schema';

export const createStaffOccupationSchema = z.discriminatedUnion(
  'occupationName',
  [
    createSuperAdminOccupationSchema,
    createAdminOccupationSchema,
    createSalespersonOccupationSchema,
  ],
);

export type CreateStaffOccupationDto = z.infer<
  typeof createStaffOccupationSchema
>;
