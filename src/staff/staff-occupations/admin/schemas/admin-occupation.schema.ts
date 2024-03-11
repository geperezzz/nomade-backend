import { z } from 'nestjs-zod/z';

import { StaffOccupationName } from 'src/staff/entities/employee.entity';

export const adminOccupationSchema = z.object({
  occupationName: z.literal(StaffOccupationName.ADMIN),
});
