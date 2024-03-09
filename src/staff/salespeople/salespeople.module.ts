import { Module } from '@nestjs/common';

import { SalespeopleService } from './salespeople.service';
import { SalespeopleController } from './salespeople.controller';

@Module({
  controllers: [SalespeopleController],
  providers: [SalespeopleService],
})
export class SalespeopleModule {}
