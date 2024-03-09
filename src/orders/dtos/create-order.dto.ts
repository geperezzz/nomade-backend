import { createZodDto } from 'nestjs-zod';
import { orderSchema } from './order.dto';
import { z } from 'nestjs-zod/z';

export const createOrderSchema = orderSchema
  .omit({
    price: true,
    payments: true
  })
  .extend({
    placementTimestamp: z.date().default(() => new Date()),
    orderedPackages: orderSchema.shape.orderedPackages.default(Array),
    orderedServices: orderSchema.shape.orderedServices.default(Array),
  });

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
