import { superAdminOccupationSchema } from './super-admin-occupation.schema';

export const updateSuperAdminOccupationSchema = superAdminOccupationSchema.omit(
  { occupationName: true },
);
