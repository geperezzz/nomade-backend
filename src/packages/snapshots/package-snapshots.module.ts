import { Module } from '@nestjs/common';

import { PackageSnapshotsService } from './package-snapshots.service';
import { PackagesModule } from '../packages.module';
import { ServiceSnapshotsModule } from 'src/services/snapshots/service-snapshots.module';

@Module({
  imports: [
    PackagesModule,
    ServiceSnapshotsModule,
  ],
  providers: [PackageSnapshotsService],
  exports: [PackageSnapshotsService],
})
export class PackageSnapshotsModule {}
