import { Module, forwardRef } from '@nestjs/common';

import { CarRentalsService } from './car-rentals.service';
import { CarRentalsController } from './car-rentals.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [CarRentalsController],
  providers: [CarRentalsService],
  exports: [CarRentalsService],
})
export class CarRentalsModule {}
