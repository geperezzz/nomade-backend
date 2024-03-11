import { Module } from '@nestjs/common';

import { StaffOccupationsService } from './staff-occupations.service';
import { StaffOccupationsController } from './staff-occupations.controller';
import { SalespersonOccupationModule } from './salesperson/salesperson-occupation.module';
import { AdminOccupationModule } from './admin/admin-occupation.module';
import { SuperAdminOccupationModule } from './superadmin/super-admin-occupation.module';

@Module({
  imports: [
    SuperAdminOccupationModule,
    AdminOccupationModule,
    SalespersonOccupationModule,
  ],
  controllers: [StaffOccupationsController],
  providers: [StaffOccupationsService],
  exports: [StaffOccupationsService],
})
export class StaffOccupationsModule {}
