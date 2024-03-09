import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateSalespersonDto } from './dtos/create-salesperson.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { SalespersonEntity } from './entities/salesperson.entity';
import { EmployeeOccupation } from '../entities/employee.entity';

@Injectable()
export class SalespeopleService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(createSalespersonDto: CreateSalespersonDto): Promise<SalespersonEntity> {
    if (await this.findOne(createSalespersonDto.employeeId)) {
      throw new Error(`The employee with ID ${createSalespersonDto.employeeId} is already a salesperson`);
    }
    
    return await this.currentTransaction.employee.update({
      where: {
        id: createSalespersonDto.employeeId,
      },
      data: {
        occupations: {
          push: EmployeeOccupation.SALESPERSON,
        },
        asSalesperson: {
          create: {},
        }
      },
    });
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<SalespersonEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.employee.findMany({
      where: {
        deletedAt: null,
        occupations: {
          has: EmployeeOccupation.SALESPERSON,
        },
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.employee.count({
      where: {
        deletedAt: null,
        occupations: {
          has: EmployeeOccupation.SALESPERSON,
        },
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
  async findOne(id: string): Promise<SalespersonEntity | null> {
    return await this.currentTransaction.employee.findUnique({
      where: {
        id,
        deletedAt: null,
        occupations: {
          has: EmployeeOccupation.SALESPERSON,
        },
      },
    });
  }

  @Transactional()
  async remove(id: string): Promise<SalespersonEntity> {
    const salesperson = await this.findOne(id);
    if (!salesperson) {
      throw new Error(`There is no salesperson with ID ${id}`);
    }
    
    return await this.currentTransaction.employee.update({
      where: {
        id,
        deletedAt: null,
        occupations: {
          has: EmployeeOccupation.SALESPERSON,
        },
      },
      data: {
        occupations: {
          set: salesperson.occupations.filter(occupation => occupation !== EmployeeOccupation.SALESPERSON),
        },
        asSalesperson: {
          delete: {},
        }
      },
    });
  }
}
