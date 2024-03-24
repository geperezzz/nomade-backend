import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SeedingConfig } from '../seeding.config';
import { StaffService } from 'src/staff/staff.service';
import { StaffOccupationsService } from 'src/staff/staff-occupations/staff-occupations.service';
import { Transactional } from '@nestjs-cls/transactional';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';
import { paymentMethodsToSeed } from './seeding-data/payment-methods-to-seed';
import { PaymentMethodsService } from 'src/payment-methods/payment-methods.service';

@Injectable()
export class ProductionSeedingService {
  configService: ConfigService<SeedingConfig, true>;
  
  constructor(
    private staffService: StaffService,
    private staffOccupationsService: StaffOccupationsService,
    private paymentMethodsService: PaymentMethodsService,
  ) {}

  @Transactional()
  async seed(configService: ConfigService<SeedingConfig, true>): Promise<void> {
    this.configService = configService;
    await Promise.all([
      this.seedSuperAdmin(),
      this.seedPaymentMethods(),
    ]);
  }

  @Transactional()
  private async seedSuperAdmin(): Promise<void> {
    const superAdminToSeed = this.configService.get('superAdminToSeed' as any);
    
    const seededSuperAdmin = await this.staffService.create(
      superAdminToSeed,
    );
    
    await this.staffOccupationsService.create(
      seededSuperAdmin.id,
      { occupationName: StaffOccupationName.SUPER_ADMIN }
    );
  }

  @Transactional()
  private async seedPaymentMethods(): Promise<void> {
    await Promise.all(
      paymentMethodsToSeed.map(async paymentMethod => {
        await this.paymentMethodsService.create(paymentMethod)
      })
    );
  }
}