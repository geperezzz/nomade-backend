import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Employee as EmployeeModel } from '@prisma/client';

import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { EmployeeEntity } from './entities/employee.entity';
import { StaffOccupationsService } from './staff-occupations/staff-occupations.service';

type EmployeeRawEntity = EmployeeModel;

@Injectable()
export class StaffService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private staffOccupationsService: StaffOccupationsService,
  ) {}

  @Transactional()
  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    const createdEmployee = await this.currentTransaction.employee.create({
      data: createEmployeeDto,
    });

    return await this.rawEntityToEntity(createdEmployee);
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<EmployeeEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const rawStaff = await this.currentTransaction.employee.findMany({
      where: {
        deletedAt: null,
      },
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });
    const items = await Promise.all(rawStaff.map(rawEmployee => this.rawEntityToEntity(rawEmployee)));

    const itemCount = await this.currentTransaction.employee.count({
      where: {
        deletedAt: null,
      },
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
    const rawEmployee = await this.currentTransaction.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    return rawEmployee ? await this.rawEntityToEntity(rawEmployee) : null;
  }

  @Transactional()
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    const updatedEmployee = await this.currentTransaction.employee.update({
      where: {
        id,
        deletedAt: null,
      },
      data: updateEmployeeDto,
    });

    return await this.rawEntityToEntity(updatedEmployee);
  }

  @Transactional()
  async remove(id: string): Promise<EmployeeEntity> {
    const removedEmployee = await this.currentTransaction.employee.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return await this.rawEntityToEntity(removedEmployee);
  }

  @Transactional()
  private async rawEntityToEntity(
    rawEmployee: EmployeeRawEntity,
  ): Promise<EmployeeEntity> {
    const occupations = await Promise.all(
      rawEmployee.occupations.map(async (occupationName) =>
        (await this.staffOccupationsService.findOne(rawEmployee.id, occupationName))!
      )
    );

    return {
      ...rawEmployee,
      occupations,
    };
  }
}
