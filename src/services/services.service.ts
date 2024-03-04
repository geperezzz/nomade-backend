import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

export type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

@Injectable()
export class ServicesService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createServiceDto: CreateServiceDto,
    transactionClient?: TransactionClient,
  ): Promise<ServiceEntity> {
    const databaseClient = transactionClient || this.prismaService;

    const createdService = await databaseClient.service.create({
      data: createServiceDto,
    });

    return createdService;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    transactionClient?: TransactionClient,
  ): Promise<ServiceEntity> {
    const databaseClient = transactionClient || this.prismaService;
    
    const updatedService = await databaseClient.service.update({
      where: {
        id,
      },
      data: updateServiceDto,
    });
    
    return updatedService;
  }
}
