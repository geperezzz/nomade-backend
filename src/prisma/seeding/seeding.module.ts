import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './seeding.config';
import { SeedingService } from './seeding.service';
import { ProductionSeedingModule } from './production/production-seeding.module';
import { DevelopmentSeedingModule } from './development/development-seeding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    ProductionSeedingModule,
    DevelopmentSeedingModule,
  ],
  providers: [SeedingService],
})
export class SeedingModule {}
