import { Module, forwardRef } from '@nestjs/common';

import { OrderPackagesService } from './order-packages.service';
import { OrderPackagesController } from './order-packages.controller';
import { OrdersModule } from '../orders.module';
import { PackageSnapshotsModule } from 'src/packages/snapshots/package-snapshots.module';

@Module({
  imports: [forwardRef(() => OrdersModule), PackageSnapshotsModule],
  controllers: [OrderPackagesController],
  providers: [OrderPackagesService],
  exports: [OrderPackagesService],
})
export class OrderPackagesModule {}
