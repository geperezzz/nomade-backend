import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './seeding.config';
import { SeedingService } from './seeding.service';
import { ProductionSeedingModule } from './production/production-seeding.module';
import { DevelopmentSeedingModule } from './development/development-seeding.module';
import { SeedingController } from './seeding.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    ProductionSeedingModule,
    DevelopmentSeedingModule,
  ],
  controllers: [SeedingController],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
