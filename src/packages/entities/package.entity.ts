import { Package as PackageModel } from '@prisma/client';
import { PackageServiceEntity } from '../services/entities/package-service.entity';

export type PackageEntity = PackageModel & {
  containedServices: PackageServiceEntity[];
};
