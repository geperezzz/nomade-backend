import { createZodDto } from 'nestjs-zod';
import { orderServiceSchema } from './order-service.dto';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const createOrderServiceSchema = orderServiceSchema
  .extend({
    serviceId: serviceSchema.shape.id,
    serviceSnapshotId: orderServiceSchema.shape.serviceSnapshotId.optional(),
  });

export class CreateOrderServiceDto extends createZodDto(createOrderServiceSchema) {}
