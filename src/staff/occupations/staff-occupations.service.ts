import { Injectable } from '@nestjs/common';
import { InjectTransaction, Transaction, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { StaffOccupationEntity } from './entities/staff-occupation.entity';
import { StaffOccupationName } from '../entities/employee.entity';
import { CreateStaffOccupationDto } from './dtos/create-staff-occupation.dto';
import { UpdateStaffOccupationDto } from './dtos/update-staff-occupation.dto';
import { StaffOccupationImplementation } from './staff-occupation-implementation.interface';
import { SalespersonOccupationService } from './salesperson/salesperson-occupation.service';
import { AdminOccupationService } from './admin/admin-occupation.service';
import { SuperAdminOccupationService } from './superadmin/superadmin-occupation.service';

@Injectable()
export class StaffOccupationsService {
  private implementations: Map<StaffOccupationName, StaffOccupationImplementation>;
  
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    superAdminOccupationService: SuperAdminOccupationService,
    adminOccupationService: AdminOccupationService,
    salespersonOccupationService: SalespersonOccupationService,
  ) {
    this.implementations = new Map<StaffOccupationName, StaffOccupationImplementation>([
      [StaffOccupationName.SUPER_ADMIN, superAdminOccupationService],
      [StaffOccupationName.ADMIN, adminOccupationService],
      [StaffOccupationName.SALESPERSON, salespersonOccupationService],
    ]);
  }

  @Transactional()
  async create(
    employeeId: string,
    createStaffOccupationDto: CreateStaffOccupationDto
  ): Promise<StaffOccupationEntity> {
    if (await this.findOne(employeeId, createStaffOccupationDto.occupationName)) {
      throw new Error(`The employee with ID ${employeeId} already has the ${createStaffOccupationDto.occupationName} occupation`);
    }
    
    await this.currentTransaction.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        occupations: {
          push: createStaffOccupationDto.occupationName,
        },
      },
    });

    return await this.implementations
      .get(createStaffOccupationDto.occupationName)!
      .create(employeeId, createStaffOccupationDto);
  }

  async findMany(
    employeeId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<StaffOccupationEntity>> {
    const employee = await this.currentTransaction.employee.findUniqueOrThrow({
      where: {
        id: employeeId,
        deletedAt: null,
      },
    });
    const occupations = await Promise.all(
      employee.occupations.map(async (occupationName) => (await this.findOne(employeeId, occupationName))!)
    );
    
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];
    const items = occupations
      .slice(itemsPerPage * (pageIndex - 1), itemsPerPage * pageIndex);
    const itemCount = occupations.length;
    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  async findOne(
    employeeId: string,
    occupationName: StaffOccupationName
  ): Promise<StaffOccupationEntity | null> {
    return await this.implementations
      .get(occupationName)!
      .find(employeeId);
  }

  async update(
    employeeId: string,
    occupationName: StaffOccupationName,
    updateStaffOccupationDto: UpdateStaffOccupationDto,
  ): Promise<StaffOccupationEntity> {
    return await this.implementations
      .get(occupationName)!
      .update(employeeId, updateStaffOccupationDto);
  }
  
  async remove(
    employeeId: string,
    occupationNameToRemove: StaffOccupationName,
  ): Promise<StaffOccupationEntity> {
    const employee = await this.currentTransaction.employee.findUniqueOrThrow({
      where: {
        id: employeeId,
        deletedAt: null,
      },
    });
    
    await this.currentTransaction.employee.update({
      where: {
        id: employeeId,
        deletedAt: null,
        occupations: {
          has: occupationNameToRemove,
        },
      },
      data: {
        occupations: {
          set: employee.occupations.filter(occupationName => occupationName !== occupationNameToRemove),
        },
      },
    });

    return await this.implementations
      .get(occupationNameToRemove)!
      .remove(employeeId);
  }
}
