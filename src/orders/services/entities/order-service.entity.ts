import { OrderService } from '@prisma/client';

export type OrderServiceEntity = Omit<OrderService, 'orderId'> & {
  serviceId: string | null,
};
