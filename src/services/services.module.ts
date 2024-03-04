import { Module, forwardRef } from '@nestjs/common';

import { HotelsPerNightModule } from './hotels-per-night/hotels-per-night.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServicesService } from './services.service';

@Module({
  imports: [
    forwardRef(() => HotelsPerNightModule),
    PrismaModule
  ],
  controllers: [],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
