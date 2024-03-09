import { Module } from '@nestjs/common';

import { StaffOccupationsService } from './staff-occupations.service';
import { StaffOccupationsController } from './staff-occupations.controller';

@Module({
  controllers: [StaffOccupationsController],
  providers: [StaffOccupationsService],
})
export class StaffOccupationsModule {}
