import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SeedingConfig, seedingConfigSchema } from './seeding.config';
import { StaffService } from 'src/staff/staff.service';
import { StaffOccupationsService } from 'src/staff/staff-occupations/staff-occupations.service';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Injectable()
export class SeedingService {
  private seedingConfig: SeedingConfig;
  
  constructor(
    private configService: ConfigService,
    private staffService: StaffService,
    private staffOccupationsService: StaffOccupationsService,
  ) {
    this.seedingConfig = seedingConfigSchema.parse(
      Object.keys(seedingConfigSchema.shape).reduce(
        (seedingConfig, key) => {
          seedingConfig[key] = this.configService.get(key);
          return seedingConfig;
        },
        {} as any,
      )
    );
  }

  @Transactional()
  async seed(): Promise<void> {
    await this.createSuperAdmin();
  }

  @Transactional()
  private async createSuperAdmin(): Promise<void> {
    const isAlreadyCreated = await this.staffService.findOneByEmail(this.seedingConfig.SUPER_ADMIN_TO_CREATE.email);
    if (isAlreadyCreated) {
      return;
    }
    
    const createdSuperAdmin = await this.staffService.create(
      this.seedingConfig.SUPER_ADMIN_TO_CREATE,
    );
    
    await this.staffOccupationsService.create(
      createdSuperAdmin.id,
      { occupationName: StaffOccupationName.SUPER_ADMIN }
    );
  }
}