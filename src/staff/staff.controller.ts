import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StaffService } from './staff.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { EmployeeDto } from './dtos/employee.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from './entities/employee.entity';

@Controller('staff')
@ApiTags('Staff')
@MustBeLoggedInAs(StaffOccupationName.SUPER_ADMIN)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeDto> {
    const createdEmployee = await this.staffService.create(createEmployeeDto);
    return EmployeeDto.fromEntity(createdEmployee);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<EmployeeDto>> {
    const foundStaffPage = await this.staffService.findMany(paginationQueryDto);
    const items = foundStaffPage.items.map(EmployeeDto.fromEntity);

    return { ...foundStaffPage, items };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeDto> {
    const foundEmployee = await this.staffService.findOne(id);

    if (!foundEmployee) {
      throw new NotFoundException(
        'Employee not found',
        `There is no Employee with ID ${id}`,
      );
    }
    return EmployeeDto.fromEntity(foundEmployee);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeDto> {
    const updatedEmployee = await this.staffService.update(
      id,
      updateEmployeeDto,
    );
    return EmployeeDto.fromEntity(updatedEmployee);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeDto> {
    const removedEmployee = await this.staffService.remove(id);
    return EmployeeDto.fromEntity(removedEmployee);
  }
}
