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
export class AdminOccupationService implements StaffOccupationImplementation {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(
    _employeeId: string,
    _createStaffOccupationDto: CreateStaffOccupationDto
  ): Promise<StaffOccupationEntity> {
    return {
      occupationName: StaffOccupationName.ADMIN,
    };
  }

  @Transactional()
  async find(employeeId: string): Promise<StaffOccupationEntity | null> {
    const employee = await this.currentTransaction.employee.findUnique({
      where: {
        id: employeeId,
        deletedAt: null,
        occupations: {
          has: StaffOccupationName.ADMIN,
        },
      },
    });

    return employee ? { occupationName: StaffOccupationName.ADMIN } : null;
  }

  async update(
    employeeId: string,
    _updateStaffOccupationDto: UpdateStaffOccupationDto,
  ): Promise<StaffOccupationEntity> {
    if (!(await this.find(employeeId))) {
      throw new Error(
        `The Employee with ID ${employeeId} does not have the admin occupation`
      );
    }
    
    return {
      occupationName: StaffOccupationName.ADMIN,
    };
  }

  @Transactional()
  async remove(_employeeId: string): Promise<StaffOccupationEntity> {
    return {
      occupationName: StaffOccupationName.ADMIN,
    };
  }
}
