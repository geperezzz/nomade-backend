import { Module } from '@nestjs/common';

import { AvailableOccupationsService } from './available-occupations.service';
import { AvailableOccupationsController } from './available-occupations.controller';

@Module({
  controllers: [AvailableOccupationsController],
  providers: [AvailableOccupationsService],
  exports: [AvailableOccupationsService],
})
export class AvailableOccupationsModule {}
