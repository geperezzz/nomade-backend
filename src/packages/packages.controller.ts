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
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dtos/create-package.dto';
import { UpdatePackageDto } from './dtos/update-package.dto';
import { PackageDto } from './dtos/package.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { ReplacePackageDto } from './dtos/replace-package.dto';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('packages')
@ApiTags('Packages')
@MustBeLoggedInAs(StaffOccupationName.SUPER_ADMIN, StaffOccupationName.ADMIN)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageDto> {
    const createdPackage = await this.packagesService.create(createPackageDto);
    return PackageDto.fromEntity(createdPackage);
  }

  @Get()
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PackageDto>> {
    const foundPackagesPage =
      await this.packagesService.findMany(paginationQueryDto);
    const items = foundPackagesPage.items.map(PackageDto.fromEntity);

    return { ...foundPackagesPage, items };
  }

  @Get(':id')
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PackageDto> {
    const foundPackage = await this.packagesService.findOne(id);

    if (!foundPackage) {
      throw new NotFoundException(
        'Package not found',
        `There is no Package with ID ${id}`,
      );
    }
    return PackageDto.fromEntity(foundPackage);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDto> {
    const updatedPackage = await this.packagesService.update(
      id,
      updatePackageDto,
    );
    return PackageDto.fromEntity(updatedPackage);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() replacePackageDto: ReplacePackageDto,
  ): Promise<PackageDto> {
    const newPackage = await this.packagesService.replace(
      id,
      replacePackageDto,
    );
    return PackageDto.fromEntity(newPackage);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<PackageDto> {
    const removedPackage = await this.packagesService.remove(id);
    return PackageDto.fromEntity(removedPackage);
  }
}
