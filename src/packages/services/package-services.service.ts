import { Injectable } from '@nestjs/common';

import { CreatePackageServiceDto } from './dtos/create-package-service.dto';
import { UpdatePackageServiceDto } from './dtos/update-package-service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { PackageServiceEntity } from './entities/package-service.entity';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PackagesService } from '../packages.service';

@Injectable()
export class PackageServicesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private packagesService: PackagesService,
  ) {}

  @Transactional()
  async create(
    packageId: string,
    createPackageServiceDto: CreatePackageServiceDto,
  ): Promise<PackageServiceEntity> {
    const createdPackageService =
      await this.currentTransaction.packageService.create({
        data: {
          ...createPackageServiceDto,
          packageId,
        },
      });
    await this.packagesService.updatePriceOfPackage(packageId);
    return createdPackageService;
  }

  @Transactional()
  async findMany(
    packageId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PackageServiceEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.packageService.findMany({
      where: {
        packageId,
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.packageService.count({
      where: {
        packageId,
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  @Transactional()
  async findOne(
    packageId: string,
    serviceId: string,
  ): Promise<PackageServiceEntity | null> {
    return await this.currentTransaction.packageService.findUnique({
      where: {
        packageId_serviceId: {
          packageId,
          serviceId,
        },
      },
    });
  }

  @Transactional()
  async update(
    packageId: string,
    serviceId: string,
    updatePackageServiceDto: UpdatePackageServiceDto,
  ): Promise<PackageServiceEntity> {
    const updatedPackageService =
      await this.currentTransaction.packageService.update({
        where: {
          packageId_serviceId: {
            packageId,
            serviceId,
          },
        },
        data: updatePackageServiceDto,
      });
    await this.packagesService.updatePriceOfPackage(packageId);
    return updatedPackageService;
  }

  @Transactional()
  async remove(
    packageId: string,
    serviceId: string,
  ): Promise<PackageServiceEntity> {
    const removedPackageService =
      await this.currentTransaction.packageService.delete({
        where: {
          packageId_serviceId: {
            packageId,
            serviceId,
          },
        },
      });
    await this.packagesService.updatePriceOfPackage(packageId);
    return removedPackageService;
  }
}
