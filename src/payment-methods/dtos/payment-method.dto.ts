import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';

export const paymentMethodSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  commissionPercentage: z.coerce.number().nonnegative().finite(),
});

export class PaymentMethodDto extends createZodDto(paymentMethodSchema) {
  static fromEntity(entity: PaymentMethodEntity): PaymentMethodDto {
    return paymentMethodSchema.parse(convertDecimalsToNumbers(entity));
  }
}
