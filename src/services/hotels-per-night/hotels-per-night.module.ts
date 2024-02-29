import { Module } from '@nestjs/common';

import { HotelsPerNightService } from './hotels-per-night.service';
import { HotelsPerNightController } from './hotels-per-night.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HotelsPerNightController],
  providers: [HotelsPerNightService],
})
export class HotelsPerNightModule {}
