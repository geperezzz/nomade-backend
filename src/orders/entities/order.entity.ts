import { Order } from '@prisma/client';

import { OrderPackageEntity } from '../packages/entities/order-package.entity';
import { OrderServiceEntity } from '../services/entities/order-service.entity';
import { OrderPaymentEntity } from '../payments/entities/order-payment.entity';

export type OrderEntity = Order & {
  orderedPackages: OrderPackageEntity[];
  orderedServices: OrderServiceEntity[];
  payments: OrderPaymentEntity[];
};
