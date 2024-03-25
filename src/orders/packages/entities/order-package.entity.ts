import {
  OrderPackage as OrderPackageModel,
  PackageSnapshot as PackageSnapshotModel,
  ServiceSnapshot,
} from '@prisma/client';

export type OrderPackageEntity = Omit<
  OrderPackageModel,
  'orderId' | 'packageSnapshotId'
> & {
  packageId: string | null;
  packageSnapshot: Omit<PackageSnapshotModel, 'originalPackageId'> & {
    containedServices: {
      serviceId: string | null;
      serviceSnapshot: Omit<ServiceSnapshot, 'originalServiceId'>;
      amountContained: number;
    }[];
  };
};
