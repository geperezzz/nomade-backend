import { createZodDto } from 'nestjs-zod';

import { createOrderServiceSchema } from './create-order-service.dto';

export const updateOrderServiceSchema = createOrderServiceSchema.partial();

export class UpdateOrderServiceDto extends createZodDto(
  updateOrderServiceSchema,
) {}
