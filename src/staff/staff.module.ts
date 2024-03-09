import { Module } from '@nestjs/common';

import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { SalespeopleModule } from './salespeople/salespeople.module';

@Module({
  imports: [SalespeopleModule],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
