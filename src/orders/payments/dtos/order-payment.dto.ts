import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { OrderPaymentEntity } from '../entities/order-payment.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';

export const orderPaymentSchema = z.object({
  paymentNumber: z.coerce.number().int(),
  paymentTimestamp: z.coerce.date(),
  netAmountPaid: z.coerce.number().nonnegative().finite(),
  amountWithCommissionPaid: z.coerce.number().nonnegative().finite(),
  appliedCommissionPercentage: z.coerce.number().min(0).max(100),
  paymentMethodId: z.string().uuid(),
});

export class OrderPaymentDto extends createZodDto(orderPaymentSchema) {
  static fromEntity(entity: OrderPaymentEntity): OrderPaymentDto {
    return orderPaymentSchema.parse(convertDecimalsToNumbers(entity));
  }
}
