import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const profitsPeriodQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .transform((profitsPeriod) => {
    profitsPeriod.from.setHours(0, 0, 0, 0);
    profitsPeriod.to.setHours(23, 59, 59, 999);
    return profitsPeriod;
  })
  .refine((profitsPeriod) => profitsPeriod.from < profitsPeriod.to, {
    message: 'The `from` date must be before or the same as the `to` date',
    path: ['from'],
  });

export class ProfitsPeriodQueryDto extends createZodDto(
  profitsPeriodQuerySchema,
) {
  from: Date = super.from;
  to: Date = super.to;
}
