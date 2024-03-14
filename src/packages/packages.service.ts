import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';

import { CreatePackageDto } from './dtos/create-package.dto';
import { UpdatePackageDto } from './dtos/update-package.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { PackageEntity } from './entities/package.entity';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ReplacePackageDto } from './dtos/replace-package.dto';

const selectPackageEntityFields = {
  include: {
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
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(createPackageDto: CreatePackageDto): Promise<PackageEntity> {
    const { id } = await this.currentTransaction.package.create({
      data: {
        ...createPackageDto,
        containedServices: {
          create: createPackageDto.containedServices,
        },
      },
      select: {
        id: true,
      },
    });

    if (!createPackageDto.containedServices) {
      return (await this.findOne(id))!;
    }
    return await this.updatePriceOfPackage(id);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PackageEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.package.findMany({
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
      ...selectPackageEntityFields,
    });

    const itemCount = await this.currentTransaction.package.count();

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
  async findOne(id: string): Promise<PackageEntity | null> {
    return await this.currentTransaction.package.findUnique({
      where: {
        id,
      },
      ...selectPackageEntityFields,
    });
  }

  @Transactional()
  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageEntity> {
    const { id: newId } = await this.currentTransaction.package.update({
      where: {
        id,
      },
      data: updatePackageDto,
      select: {
        id: true,
      },
    });

    if (!updatePackageDto.appliedDiscountPercentage) {
      return (await this.findOne(newId))!;
    }
    return await this.updatePriceOfPackage(newId);
  }

  @Transactional()
  async replace(
    id: string,
    replacePackageDto: ReplacePackageDto,
  ): Promise<PackageEntity> {
    const { id: newId } = await this.currentTransaction.package.update({
      where: {
        id,
      },
      data: {
        ...replacePackageDto,
        containedServices: {
          deleteMany: {},
        }
      },
      select: {
        id: true,
      },
    });

    await this.currentTransaction.package.update({
      where: {
        id: newId,
      },
      data: {
        containedServices: {
          create: replacePackageDto.containedServices,
        },
      },
    });

    return await this.updatePriceOfPackage(newId);
  }

  @Transactional()
  async remove(id: string): Promise<PackageEntity> {
    return await this.currentTransaction.package.delete({
      where: {
        id,
      },
      ...selectPackageEntityFields,
    });
  }

  @Transactional()
  async updatePriceOfPackage(id: string): Promise<PackageEntity> {
    const { appliedDiscountPercentage, containedServices } =
      await this.currentTransaction.package.findUniqueOrThrow({
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
            .times(Decimal.sub(100, appliedDiscountPercentage).div(100)),
        );
      },
      new Decimal(0),
    );

    return await this.currentTransaction.package.update({
      where: {
        id,
      },
      data: {
        price,
      },
      ...selectPackageEntityFields,
    });
  }

  @Transactional()
  async updatePriceOfPackagesContainingTheService(
    serviceId: string,
  ): Promise<void> {
    const packagesContainingTheService =
      await this.currentTransaction.package.findMany({
        where: {
          containedServices: {
            some: {
              serviceId,
            },
          },
        },
        select: {
          id: true,
        },
      });

    await Promise.all(
      packagesContainingTheService.map(({ id }) =>
        this.updatePriceOfPackage(id),
      ),
    );
  }
}
