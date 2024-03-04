import { Module } from '@nestjs/common';

import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
