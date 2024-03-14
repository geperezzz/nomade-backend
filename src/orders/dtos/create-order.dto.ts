import { createZodDto } from 'nestjs-zod';
import { orderSchema } from './order.dto';
import { z } from 'nestjs-zod/z';
import { createOrderPackageSchema } from '../packages/dtos/create-order-package.dto';
import { createOrderServiceSchema } from '../services/dtos/create-order-service.dto';

export const createOrderSchema = orderSchema
  .omit({
    price: true,
    payments: true
  })
  .extend({
    id: orderSchema.shape.id.optional(),
    placementTimestamp: z.coerce.date().default(() => new Date()),
    orderedPackages: z.array(createOrderPackageSchema).default(Array),
    orderedServices: z.array(createOrderServiceSchema).default(Array),
  });

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
