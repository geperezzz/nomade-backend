import {
  Package as PackageModel,
  PackageService as PackageServiceModel,
} from '@prisma/client';

export type PackageEntity = PackageModel & {
  containedServices: Omit<PackageServiceModel, 'packageId'>[];
};
