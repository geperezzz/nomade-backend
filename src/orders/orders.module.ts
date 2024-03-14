import { Module, forwardRef } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderPackagesModule } from './packages/order-packages.module';
import { OrderServicesModule } from './services/order-services.module';
import { OrderPaymentsModule } from './payments/order-payments.module';

@Module({
  imports: [
    forwardRef(() => OrderPackagesModule),
    forwardRef(() => OrderServicesModule),
    OrderPaymentsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
