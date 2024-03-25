import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeedingService } from './seeding.service';
import { NoLoginRequired } from 'src/auth/no-login-required.decorator';

@Controller('seed-database')
@ApiTags('Seed Database')
export class SeedingController {
  constructor(
    private seedingService: SeedingService,
  ) {}

  @Post()
  @HttpCode(200)
  @NoLoginRequired()
  async seedDatabase() {
    await this.seedingService.seed();
  }
}