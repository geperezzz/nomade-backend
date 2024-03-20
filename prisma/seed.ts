import { NestFactory } from '@nestjs/core'

import { AppModule } from 'src/app/app.module';
import { SeedingService } from 'src/prisma/seeding/seeding.service';

async function main() {
  const nomadeApp = await NestFactory.createApplicationContext(AppModule);
  const seedingService = nomadeApp.get(SeedingService);
  await seedingService.seed();
  await nomadeApp.close();
}

main();