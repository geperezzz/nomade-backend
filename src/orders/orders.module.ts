import { Module, forwardRef } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderPackagesModule } from './packages/order-packages.module';
import { OrderServicesModule } from './services/order-services.module';
import { OrderPaymentsModule } from './payments/order-payments.module';
import { PackageSnapshotsModule } from 'src/packages/snapshots/package-snapshots.module';
import { ServiceSnapshotsModule } from 'src/services/snapshots/service-snapshots.module';

@Module({
  imports: [
    forwardRef(() => OrderPackagesModule),
    forwardRef(() => OrderServicesModule),
    OrderPaymentsModule,
    PackageSnapshotsModule,
    ServiceSnapshotsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
