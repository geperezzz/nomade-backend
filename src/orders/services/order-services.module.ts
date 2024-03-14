import { Module, forwardRef } from '@nestjs/common';

import { OrderServicesService } from './order-services.service';
import { OrderServicesController } from './order-services.controller';
import { OrdersModule } from '../orders.module';
import { ServiceSnapshotsModule } from 'src/services/snapshots/service-snapshots.module';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    ServiceSnapshotsModule,
  ],
  controllers: [OrderServicesController],
  providers: [OrderServicesService],
  exports: [OrderServicesService],
})
export class OrderServicesModule {}
