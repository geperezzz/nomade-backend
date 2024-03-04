import { Injectable } from '@nestjs/common';

import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    return await this.prismaService.customer.create({
      data: createCustomerDto,
    });
  }

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<CustomerEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const [items, itemCount] = await this.prismaService.$transaction([
      this.prismaService.customer.findMany({
        where: {
          deletedAt: null,
        },
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      }),
      this.prismaService.customer.count({
        where: {
          deletedAt: null,
        },
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

  async findOne(id: string): Promise<CustomerEntity | null> {
    return await this.prismaService.customer.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    return await this.prismaService.customer.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateCustomerDto,
    });
  }

  async remove(id: string): Promise<CustomerEntity> {
    return await this.prismaService.customer.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
