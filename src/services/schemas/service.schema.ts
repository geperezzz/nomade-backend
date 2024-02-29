import { z } from 'nestjs-zod/z';

export const serviceSchema = z.object({
  id: z.string().uuid(),
  serviceName: z.string(),
  serviceDescription: z.string(),
  serviceLocation: z.string(),
  servicePrice: z.coerce.number().nonnegative().finite(),
  serviceTimestamp: z.coerce.date(),
});
