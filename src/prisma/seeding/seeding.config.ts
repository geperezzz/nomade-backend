import { z } from 'nestjs-zod/z';

import { createEmployeeSchema } from 'src/staff/dtos/create-employee.dto';

export const seedingConfigSchema = z.object({
  SUPER_ADMIN_TO_CREATE: z
    .string()
    .transform(
      (superAdminToCreate, context) => {
        try {
          return JSON.parse(superAdminToCreate);
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: '`SUPER_ADMIN_TO_CREATE` must be a valid JSON object',
            path: ['SUPER_ADMIN_TO_CREATE'],
          });
          return z.NEVER;
        }
      }
    )
    .pipe(createEmployeeSchema),
});

export type SeedingConfig = z.infer<typeof seedingConfigSchema>;

export function validate(seedingConfig: Record<string, any>): SeedingConfig {
  return seedingConfigSchema.parse(seedingConfig);
}
