import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { OrderServiceEntity } from '../entities/order-service.entity';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const orderServiceSchema = z.object({
  serviceId: serviceSchema.shape.id.optional(),
  serviceSnapshotId: z.string().uuid(),
  amountOrdered: z.coerce.number().positive(),
});

export class OrderServiceDto extends createZodDto(orderServiceSchema) {
  static fromEntity(entity: OrderServiceEntity): OrderServiceDto {
    return orderServiceSchema.parse(entity);
  }
}
