import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { createOrderSchema } from './create-order.dto';
import { createOrderServiceSchema } from '../services/dtos/create-order-service.dto';
import { createOrderPackageSchema } from '../packages/dtos/create-order-package.dto';

export const updateOrderSchema = createOrderSchema
  .partial()
  .extend({
    placementTimestamp: z.coerce.date().optional(),
    orderedPackages: z.array(createOrderPackageSchema).optional(),
    orderedServices: z.array(createOrderServiceSchema).optional(),
  });

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
