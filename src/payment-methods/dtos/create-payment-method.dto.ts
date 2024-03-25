import { createZodDto } from 'nestjs-zod';
import { paymentMethodSchema } from './payment-method.dto';

export const createPaymentMethodSchema = paymentMethodSchema.extend({
  id: paymentMethodSchema.shape.id.optional(),
});

export class CreatePaymentMethodDto extends createZodDto(
  createPaymentMethodSchema,
) {}
