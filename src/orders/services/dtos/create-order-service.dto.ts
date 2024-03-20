import { createZodDto } from 'nestjs-zod';
import { orderServiceSchema } from './order-service.dto';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const createOrderServiceSchema = orderServiceSchema
  .extend({
    serviceId: serviceSchema.shape.id,
    serviceSnapshot: orderServiceSchema.shape.serviceSnapshot.pick({ id: true }).optional(),
  });

export class CreateOrderServiceDto extends createZodDto(createOrderServiceSchema) {}
