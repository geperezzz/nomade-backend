import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PackagesService } from '../packages.service';
import { ServiceSnapshotsService } from 'src/services/snapshots/service-snapshots.service';

@Injectable()
export class PackageSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private packagesService: PackagesService,
    private serviceSnapshotsService: ServiceSnapshotsService,
  ) {}

  @Transactional()
  async pickLatestSnapshotOf(packageId: string): Promise<string> {
    const originalPackage = await this.packagesService.findOne(packageId);
    if (!originalPackage) {
      throw new Error(
        `Original package not found: There is no Package with ID ${packageId}`
      );
    }

    const latestSnapshot = await this.currentTransaction.packageSnapshot.findFirst({
      where: {
        originalPackageId: packageId,
      },
      orderBy: {
        snapshotTimestamp: 'desc',
      },
      select: {
        id: true,
        snapshotTimestamp: true,
      },
    });

    if (!latestSnapshot || latestSnapshot.snapshotTimestamp < originalPackage.lastUpdateTimestamp) {
      return this.createSnapshotOf(packageId);
    }
    return latestSnapshot.id;
  }

  @Transactional()
  async createSnapshotOf(packageId: string): Promise<string> {
    const originalPackage = await this.packagesService.findOne(packageId);
    if (!originalPackage) {
      throw new Error(
        `Original package not found: There is no Package with ID ${packageId}`
      );
    }
    
    const containedServicesAsSnapshots = await Promise.all(
      originalPackage.containedServices.map(
        async ({ serviceId, amountContained }) => ({
          serviceId: await this.serviceSnapshotsService.createSnapshotOf(serviceId),
          amountContained,
        })
      )
    );

    const { id: snapshotId } = await this.currentTransaction.packageSnapshot.create({
      data: {
        ...originalPackage,
        id: undefined, // Remove the original ID and generate a new one
        originalPackageId: packageId,
        containedServices: {
          create: containedServicesAsSnapshots,
        },
      },
      select: {
        id: true,
      },
    });

    return snapshotId;
  }
}
