import { Module } from '@nestjs/common';

import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffOccupationsModule } from './staff-occupations/staff-occupations.module';

@Module({
  imports: [StaffOccupationsModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
