import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { StaffOccupationImplementation } from '../staff-occupation-implementation.interface';
import { StaffOccupationEntity } from '../entities/staff-occupation.entity';
import { CreateStaffOccupationDto } from '../dtos/create-staff-occupation.dto';
import { UpdateStaffOccupationDto } from '../dtos/update-staff-occupation.dto';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Injectable()
export class SalespersonOccupationService
  implements StaffOccupationImplementation
{
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(
    employeeId: string,
    _createStaffOccupationDto: CreateStaffOccupationDto,
  ): Promise<StaffOccupationEntity> {
    await this.currentTransaction.salesperson.create({
      data: {
        id: employeeId,
      },
    });

    return {
      occupationName: StaffOccupationName.SALESPERSON,
    };
  }

  @Transactional()
  async find(employeeId: string): Promise<StaffOccupationEntity | null> {
    const employee = await this.currentTransaction.employee.findUnique({
      where: {
        id: employeeId,
        deletedAt: null,
        occupations: {
          has: StaffOccupationName.SALESPERSON,
        },
      },
    });

    return employee
      ? { occupationName: StaffOccupationName.SALESPERSON }
      : null;
  }

  async update(
    employeeId: string,
    _updateStaffOccupationDto: UpdateStaffOccupationDto,
  ): Promise<StaffOccupationEntity> {
    if (!(await this.find(employeeId))) {
      throw new Error(
        `The Employee with ID ${employeeId} does not have the salesperson occupation`,
      );
    }

    return {
      occupationName: StaffOccupationName.SALESPERSON,
    };
  }

  @Transactional()
  async remove(employeeId: string): Promise<StaffOccupationEntity> {
    await this.currentTransaction.salesperson.delete({
      where: {
        id: employeeId,
      },
    });

    return {
      occupationName: StaffOccupationName.SALESPERSON,
    };
  }
}
