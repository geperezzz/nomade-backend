import { Module, forwardRef } from '@nestjs/common';

import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PackageServicesModule } from './services/package-services.module';

@Module({
  imports: [forwardRef(() => PackageServicesModule)],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
