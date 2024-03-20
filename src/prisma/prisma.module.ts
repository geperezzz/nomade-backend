import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { SeedingModule } from './seeding/seeding.module';

@Module({
  imports: [SeedingModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
