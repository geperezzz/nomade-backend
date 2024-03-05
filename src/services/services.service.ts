import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { PackagesService } from 'src/packages/packages.service';
import { InjectTransaction, Transaction, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

export type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

@Injectable()
export class ServicesService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private packagesService: PackagesService,
  ) {}

  @Transactional()
  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceEntity> {
    const createdService = await this.currentTransaction.service.create({
      data: createServiceDto,
    });

    return createdService;
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
