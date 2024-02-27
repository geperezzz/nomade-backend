import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';

import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.interface';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.prismaService.customer.create({
      data: createCustomerDto,
    });
  }

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<Customer>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    let items!: Customer[];
    let itemCount!: number;
    await this.prismaService.$transaction(async (transaction) => {
      items = await transaction.customer.findMany({
        where: {
          isDeleted: false,
        },
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });

      itemCount = await transaction.customer.count({
        where: {
          isDeleted: false,
        },
        skip: itemsPerPage * (pageIndex - 1),
        take: itemsPerPage,
      });
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

  async findOne(id: string): Promise<Customer | null> {
    return await this.prismaService.customer.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.prismaService.customer.update({
      where: {
        id,
        isDeleted: false,
      },
      data: updateCustomerDto,
    });
  }

  async remove(id: string): Promise<Customer> {
    return await this.prismaService.customer.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
