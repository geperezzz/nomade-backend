import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightService } from './hotels-per-night.service';
import { HotelsPerNightController } from './hotels-per-night.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServicesModule } from '../services.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ServicesModule),
  ],
  controllers: [HotelsPerNightController],
  providers: [HotelsPerNightService],
})
export class HotelsPerNightModule {}
