import { Module } from '@nestjs/common';

import { OrderPaymentsService } from './order-payments.service';
import { OrderPaymentsController } from './order-payments.controller';

@Module({
  controllers: [OrderPaymentsController],
  providers: [OrderPaymentsService],
})
export class OrderPaymentsModule {}
