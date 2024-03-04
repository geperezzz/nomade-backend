import {
  Package as PackageModel,
  PackageService as PackageServiceModel,
} from '@prisma/client';

export type PackageEntity = Omit<PackageModel, 'lastUpdateTimestamp'> & {
  containedServices: Omit<PackageServiceModel, 'packageId'>[];
};
