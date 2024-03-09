import { createZodDto } from 'nestjs-zod';

import { createOrderSchema } from './create-order.dto';
import { z } from 'nestjs-zod/z';

export const updateOrderSchema = createOrderSchema
  .omit({
    orderedPackages: true,
    orderedServices: true,
  })
  .partial()
  .extend({
    placementTimestamp: z.date().optional(),
  });

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
