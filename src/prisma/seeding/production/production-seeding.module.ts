import { Module } from '@nestjs/common';

import { StaffModule } from 'src/staff/staff.module';
import { StaffOccupationsModule } from 'src/staff/staff-occupations/staff-occupations.module';
import { ProductionSeedingService } from './production-seeding.service';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';

@Module({
  imports: [
    StaffModule,
    StaffOccupationsModule,
    PaymentMethodsModule,
  ],
  providers: [ProductionSeedingService],
  exports: [ProductionSeedingService],
})
export class ProductionSeedingModule {}