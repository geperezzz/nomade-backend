import { createZodDto } from 'nestjs-zod';
import { orderPaymentSchema } from './order-payment.dto';

export const createOrderPaymentSchema = orderPaymentSchema
  .omit({
    amountWithCommissionPaid: true,
    appliedCommissionPercentage: true,
  })
  .extend({
    paymentNumber: orderPaymentSchema.shape.paymentNumber.optional(),
  });

export class CreateOrderPaymentDto extends createZodDto(
  createOrderPaymentSchema,
) {}
