import { z } from 'nestjs-zod/z';

import { StaffOccupationName } from 'src/staff/entities/employee.entity';

export const superAdminOccupationSchema = z.object({
  occupationName: z.literal(StaffOccupationName.SUPER_ADMIN),
});
