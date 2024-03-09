import { createZodDto } from 'nestjs-zod';

import { createOrderPaymentSchema } from './create-order-payment.dto';

export const updateOrderPaymentSchema = createOrderPaymentSchema.partial();

export class UpdateOrderPaymentDto extends createZodDto(updateOrderPaymentSchema) {}
