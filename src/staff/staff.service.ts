import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { EmployeeEntity } from './entities/employee.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    return await this.currentTransaction.employee.create({
      data: createEmployeeDto,
    });
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<EmployeeEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.employee.findMany({
      where: {
        deletedAt: null,
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.employee.count({
      where: {
        deletedAt: null,
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
  async findOne(id: string): Promise<EmployeeEntity | null> {
    return await this.currentTransaction.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  @Transactional()
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    return await this.currentTransaction.employee.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateEmployeeDto,
    });
  }

  @Transactional()
  async remove(id: string): Promise<EmployeeEntity> {
    return await this.currentTransaction.employee.update({
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
