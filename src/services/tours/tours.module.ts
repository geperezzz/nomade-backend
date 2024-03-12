import { Module, forwardRef } from '@nestjs/common';

import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { ServicesModule } from '../services.module';

@Module({
  imports: [forwardRef(() => ServicesModule)],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
