import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export function zodPipeFor<T extends z.ZodTypeAny>(zodType: T) {
  return new ZodValidationPipe(zodType);
}
