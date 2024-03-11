import { Module } from '@nestjs/common';

import { AdminOccupationService } from './admin-occupation.service';

@Module({
  providers: [AdminOccupationService],
  exports: [AdminOccupationService],
})
export class AdminOccupationModule {}
