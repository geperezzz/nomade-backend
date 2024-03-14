import { PackageService as PackageServiceModel, Service as ServiceModel } from '@prisma/client';

export type PackageServiceEntity = Omit<PackageServiceModel, 'packageId' | 'serviceId'> & {
  service: ServiceModel;
};
