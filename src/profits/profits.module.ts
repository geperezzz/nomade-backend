import { Module } from '@nestjs/common';
import { ProfitsService } from './profits.service';
import { ProfitsController } from './profits.controller';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [ProfitsController],
  providers: [ProfitsService],
})
export class ProfitsModule {}
