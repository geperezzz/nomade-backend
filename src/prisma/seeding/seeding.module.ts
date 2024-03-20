import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './seeding.config';
import { SeedingService } from './seeding.service';
import { StaffModule } from 'src/staff/staff.module';
import { StaffOccupationsModule } from 'src/staff/staff-occupations/staff-occupations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    StaffModule,
    StaffOccupationsModule,
  ],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}