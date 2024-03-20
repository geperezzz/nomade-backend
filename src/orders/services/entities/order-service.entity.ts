import { OrderService as OrderServiceModel, ServiceSnapshot as ServiceSnapshotModel } from '@prisma/client';

export type OrderServiceEntity = Omit<OrderServiceModel, 'orderId' | 'serviceSnapshotId'> & {
  serviceId: string | null,
  serviceSnapshot: Omit<ServiceSnapshotModel, 'originalServiceId'>,
};
