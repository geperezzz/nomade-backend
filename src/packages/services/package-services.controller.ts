import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PackageServicesService } from './package-services.service';
import { CreatePackageServiceDto } from './dtos/create-package-service.dto';
import { UpdatePackageServiceDto } from './dtos/update-package-service.dto';
import { PackageServiceDto } from './dtos/package-service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('packages/:packageId/services')
@ApiTags('Packages\' services')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
)
export class PackageServicesController {
  constructor(
    private readonly packageServicesService: PackageServicesService,
  ) {}

  @Post()
  async create(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Body() createPackageServiceDto: CreatePackageServiceDto,
  ): Promise<PackageServiceDto> {
    const createdPackage = await this.packageServicesService.create(
      packageId,
      createPackageServiceDto,
    );
    return PackageServiceDto.fromEntity(createdPackage);
  }

  @Get()
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
  async findMany(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PackageServiceDto>> {
    const foundPackagesPage = await this.packageServicesService.findMany(
      packageId,
      paginationQueryDto,
    );
    const items = foundPackagesPage.items.map(PackageServiceDto.fromEntity);

    return { ...foundPackagesPage, items };
  }

  @Get(':serviceId')
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
  async findOne(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<PackageServiceDto> {
    const foundPackage = await this.packageServicesService.findOne(
      packageId,
      serviceId,
    );

    if (!foundPackage) {
      throw new NotFoundException(
        'Package service not found',
        `There is no package with ID ${packageId} that contains a service with ID ${serviceId}`,
      );
    }
    return PackageServiceDto.fromEntity(foundPackage);
  }

  @Patch(':serviceId')
  async update(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() updatePackageServiceDto: UpdatePackageServiceDto,
  ): Promise<PackageServiceDto> {
    const updatedPackage = await this.packageServicesService.update(
      packageId,
      serviceId,
      updatePackageServiceDto,
    );
    return PackageServiceDto.fromEntity(updatedPackage);
  }

  @Delete(':serviceId')
  async remove(
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<PackageServiceDto> {
    const removedPackage = await this.packageServicesService.remove(
      packageId,
      serviceId,
    );
    return PackageServiceDto.fromEntity(removedPackage);
  }
}
