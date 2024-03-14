import { OrderPackage } from '@prisma/client';

export type OrderPackageEntity = Omit<OrderPackage, 'orderId'> & {
  packageId: string | null;
};
