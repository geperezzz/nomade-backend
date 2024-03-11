import { Module } from '@nestjs/common';

import { SalespersonOccupationService } from './salesperson-occupation.service';

@Module({
  providers: [SalespersonOccupationService],
  exports: [SalespersonOccupationService],
})
export class SalespersonOccupationModule {}
