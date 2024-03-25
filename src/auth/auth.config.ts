import { z } from 'nestjs-zod/z';

export const authenticationConfigSchema = z.object({
  AUTHENTICATION_TOKEN_SECRET: z.string(),
  AUTHENTICATION_TOKEN_EXPIRES_IN: z.string(),
});

export type AuthenticationConfig = z.infer<typeof authenticationConfigSchema>;

export function validate(
  authenticationConfig: Record<string, any>,
): AuthenticationConfig {
  return authenticationConfigSchema.parse(authenticationConfig);
}
