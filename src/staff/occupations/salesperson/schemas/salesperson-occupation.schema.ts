import { z } from 'nestjs-zod/z';

import { StaffOccupationName } from 'src/staff/entities/employee.entity';

export const salespersonOccupationSchema = z.object({
  occupationName: z.literal(StaffOccupationName.SALESPERSON),
});
