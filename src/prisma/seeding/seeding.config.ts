import { z } from 'nestjs-zod/z';

import { createEmployeeSchema } from 'src/staff/dtos/create-employee.dto';

export const seedingConfigSchema = z.discriminatedUnion('databaseSeeding', [
  z.object({
    databaseSeeding: z.literal('production'),
    superAdminToSeed: z
      .string()
      .transform(
        (superAdminToCreate, context) => {
          try {
            return JSON.parse(superAdminToCreate);
          } catch {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: '`superAdminToSeed` must be a valid JSON object',
              path: ['superAdminToSeed'],
            });
            return z.NEVER;
          }
        }
      )
      .pipe(createEmployeeSchema),
  }),
  z.object({
    databaseSeeding: z.literal('development'),
  }),
  z.object({
    databaseSeeding: z.literal('none'),
  }),
]);

export type SeedingConfig = z.infer<typeof seedingConfigSchema>;

export function config(): SeedingConfig {
  return seedingConfigSchema.parse({
    databaseSeeding: process.env.DATABASE_SEEDING,
    superAdminToSeed: process.env.SUPER_ADMIN_TO_SEED,
  });
}
