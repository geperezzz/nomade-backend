import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { OrderEntity } from '../entities/order.entity';
import { orderPackageSchema } from '../packages/dtos/order-package.dto';
import { orderServiceSchema } from '../services/dtos/order-service.dto';
import { orderPaymentSchema } from '../payments/dtos/order-payment.dto';
import { customerSchema } from 'src/customers/dtos/customer.dto';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';

export const orderSchema = z.object({
  id: z.string().uuid(),
  orderedPackages: z.array(orderPackageSchema),
  orderedServices: z.array(orderServiceSchema),
  price: z.coerce.number().nonnegative().finite(),
  payments: z.array(orderPaymentSchema),
  customerId: customerSchema.shape.id,
  salesmanId: z.string().uuid(),
  placementTimestamp: z.date(),
});

export class OrderDto extends createZodDto(orderSchema) {
  static fromEntity(entity: OrderEntity): OrderDto {
    return orderSchema.parse(convertDecimalsToNumbers(entity));
  }
}
