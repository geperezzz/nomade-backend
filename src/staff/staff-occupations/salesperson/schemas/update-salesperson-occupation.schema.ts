import { salespersonOccupationSchema } from './salesperson-occupation.schema';

export const updateSalespersonOccupationSchema =
  salespersonOccupationSchema.omit({ occupationName: true });
