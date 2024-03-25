import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { createOrderSchema } from './create-order.dto';

export const updateOrderSchema = createOrderSchema
  .omit({
    orderedPackages: true,
    orderedServices: true,
  })
  .partial()
  .extend({
    placementTimestamp: z.coerce.date().optional(),
  });

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
