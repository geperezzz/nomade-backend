import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { PackagesService } from 'src/packages/packages.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Injectable()
export class ServicesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private packagesService: PackagesService,
  ) {}

  @Transactional()
  async create(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
    return await this.currentTransaction.service.create({
      data: createServiceDto,
    });
  }
  
  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<ServiceEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];
    
    const items =
    await this.currentTransaction.service.findMany({
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    
    const itemCount = await this.currentTransaction.service.count();
    
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
  async findOne(id: string): Promise<ServiceEntity | null> {
    return await this.currentTransaction.service.findUnique({
      where: {
        id,
      },
    });
  }
    
  @Transactional()
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    const updatedService = await this.currentTransaction.service.update({
      where: {
        id,
      },
      data: updateServiceDto,
    });

    if (updateServiceDto.servicePrice) {
      await this.packagesService.updatePriceOfPackagesContainingTheService(id);
    }

    return updatedService;
  }
}
