import { adminOccupationSchema } from './admin-occupation.schema';

export const updateAdminOccupationSchema = adminOccupationSchema.omit({ occupationName: true });