import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { CreatePackageDto } from './dtos/create-package.dto';
import { UpdatePackageDto } from './dtos/update-package.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { PackageEntity } from './entities/package.entity';

const selectPackageEntityFields = {
  select: {
    id: true,
    name: true,
    description: true,
    price: true,
    appliedDiscountPercentage: true,
    containedServices: {
      select: {
        serviceId: true,
        amountContained: true,
      },
    },
  },
} as const;

@Injectable()
export class PackagesService {
  constructor(private prismaService: PrismaService) {}

  async create(createPackageDto: CreatePackageDto): Promise<PackageEntity> {
    const { id } = await this.prismaService.package.create({
      data: {
        ...createPackageDto,
        containedServices: {
          create: createPackageDto.containedServices,
        }
      },
      select: {
        id: true,
      }
    });

    if (!createPackageDto.containedServices) {
      return (await this.findOne(id))!;
    }
    return await this.updatePriceOfPackage(id);
  }

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PackageEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const [items, itemCount] = await this.prismaService.$transaction([
      this.prismaService.package.findMany({
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
        ...selectPackageEntityFields,
      }),
      this.prismaService.package.count({
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      }),
    ]);
    
    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  async findOne(id: string): Promise<PackageEntity | null> {
    return await this.prismaService.package.findUnique({
      where: {
        id,
      },
      ...selectPackageEntityFields,
    });
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageEntity> {
    const { id: newId } = await this.prismaService.package.update({
      where: {
        id,
      },
      data: updatePackageDto,
      select: {
        id: true,
      }
    });

    if (!updatePackageDto.appliedDiscountPercentage) {
      return (await this.findOne(newId))!;
    }
    return await this.updatePriceOfPackage(newId);
  }

  async remove(id: string): Promise<PackageEntity> {
    return await this.prismaService.package.delete({
      where: {
        id,
      },
      ...selectPackageEntityFields,
    });
  }

  async updatePriceOfPackage(id: string): Promise<PackageEntity> {
    const { appliedDiscountPercentage, containedServices } = await this.prismaService.package.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        appliedDiscountPercentage: true,
        containedServices: {
          select: {
            service: {
              select: {
                servicePrice: true,
              },
            },
            amountContained: true,
          },
        },
      },
    });

    const price = containedServices.reduce(
      (currentPrice, { service, amountContained }) => {
        return currentPrice.add(
          service.servicePrice
            .times(amountContained)
            .times(Decimal.sub(100, appliedDiscountPercentage).div(100))
        )
      },
      new Decimal(0),
    );

    return await this.prismaService.package.update({
      where: {
        id,
      },
      data: {
        price,
      },
      ...selectPackageEntityFields,
    });
  }
}
