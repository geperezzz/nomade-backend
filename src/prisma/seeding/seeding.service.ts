import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SeedingConfig } from './seeding.config';
import { ProductionSeedingService } from './production/production-seeding.service';
import { DevelopmentSeedingService } from './development/development-seeding.service';

interface SeedingImplementation {
  seed(configService: ConfigService<SeedingConfig, true>): Promise<void>;
}

@Injectable()
export class SeedingService implements OnModuleInit {
  implementations: Map<SeedingConfig['databaseSeeding'], SeedingImplementation>;

  constructor(
    private configService: ConfigService<SeedingConfig, true>,
    productionSeedingService: ProductionSeedingService,
    developmentSeedingService: DevelopmentSeedingService,
  ) {
    this.implementations = new Map<
      SeedingConfig['databaseSeeding'],
      SeedingImplementation
    >([
      ['production', productionSeedingService],
      ['development', developmentSeedingService],
      [
        'none',
        {
          async seed() {
            return;
          },
        },
      ],
    ]);
  }

  async onModuleInit(): Promise<void> {
    const databaseSeed = this.configService.get('databaseSeeding', {
      infer: true,
    })!;
    this.implementations.get(databaseSeed)!.seed(this.configService);
  }
}
