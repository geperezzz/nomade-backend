import { Module } from '@nestjs/common';

import { SuperAdminOccupationService } from './superadmin-occupation.service';

@Module({
  providers: [SuperAdminOccupationService],
  exports: [SuperAdminOccupationService],
})
export class SuperAdminOccupationModule {}
