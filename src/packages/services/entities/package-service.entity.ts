import { PackageService as PackageServiceModel } from '@prisma/client';

export type PackageServiceEntity = Omit<PackageServiceModel, 'packageId'>;
