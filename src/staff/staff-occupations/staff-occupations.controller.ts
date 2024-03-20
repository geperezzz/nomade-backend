import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import { StaffOccupationsService } from './staff-occupations.service';
import { StaffOccupationDto } from './dtos/staff-occupation.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { CreateStaffOccupationDto, createStaffOccupationSchema } from './dtos/create-staff-occupation.dto';
import { StaffOccupationName } from '../entities/employee.entity';
import { UpdateStaffOccupationDto, updateStaffOccupationSchema } from './dtos/update-staff-occupation.dto';
import { zodPipeFor } from 'src/common/zod-pipe-for';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';

@Controller('staff/:employeeId/occupations')
@ApiTags('Staff\'s occupations')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
)
export class StaffOccupationsController {
  constructor(private readonly staffOccupationsService: StaffOccupationsService) {}

  @Post()
  @ApiBody({ schema: zodToOpenAPI(createStaffOccupationSchema) })
  async create(
    @Param('employeeId') employeeId: string,
    @Body(zodPipeFor(createStaffOccupationSchema)) createStaffOccupationDto: CreateStaffOccupationDto,
  ): Promise<StaffOccupationDto> {
    const createdOccupation =
      await this.staffOccupationsService.create(employeeId, createStaffOccupationDto);
    return StaffOccupationDto.fromEntity(createdOccupation);
  }

  @Get()
  async findMany(
    @Param('employeeId') employeeId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<StaffOccupationDto>> {
    const foundOccupationsPage = await this.staffOccupationsService.findMany(employeeId, paginationQueryDto);
    const items = foundOccupationsPage.items.map(StaffOccupationDto.fromEntity);

    return { ...foundOccupationsPage, items };
  }

  @Patch(':occupationName')
  @ApiBody({ schema: zodToOpenAPI(updateStaffOccupationSchema) })
  async update(
    @Param('employeeId') employeeId: string,
    @Param('occupationName', new ParseEnumPipe(StaffOccupationName)) occupationName: StaffOccupationName,
    @Body(zodPipeFor(updateStaffOccupationSchema)) updateStaffOccupationDto: UpdateStaffOccupationDto,
  ): Promise<StaffOccupationDto> {
    const updatedOccupation = await this.staffOccupationsService.update(
      employeeId,
      occupationName,
      updateStaffOccupationDto,
    );
    return StaffOccupationDto.fromEntity(updatedOccupation);
  }

  @Delete(':occupationName')
  async remove(
    @Param('employeeId') employeeId: string,
    @Param('occupationName', new ParseEnumPipe(StaffOccupationName)) occupationName: StaffOccupationName,
  ): Promise<StaffOccupationDto> {
    const removedOccupation = await this.staffOccupationsService.remove(employeeId, occupationName);
    return StaffOccupationDto.fromEntity(removedOccupation);
  }
}
