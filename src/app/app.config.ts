import { z } from 'nestjs-zod/z';

export const appConfigSchema = z.object({
  APP_HOST: z.string(),
  APP_PORT: z.coerce.number().int(),
  APP_VERSION: z.string(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function validate(appConfig: Record<string, any>): AppConfig {
  return appConfigSchema.parse(appConfig);
}
