import { Module, forwardRef } from '@nestjs/common';

import { PackageServicesService } from './package-services.service';
import { PackageServicesController } from './package-services.controller';
import { PackagesModule } from '../packages.module';

@Module({
  imports: [forwardRef(() => PackagesModule)],
  controllers: [PackageServicesController],
  providers: [PackageServicesService],
})
export class PackageServicesModule {}
