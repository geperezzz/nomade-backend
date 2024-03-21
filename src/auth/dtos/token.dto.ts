import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const tokenSchema = z
  .object({
    token: z.string(),
  });

export class TokenDto extends createZodDto(tokenSchema) {}