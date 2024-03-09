import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StaffOccupationsService } from './staff-occupations.service';
import { StaffOccupationDto } from './dtos/staff-occupation.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('staff/occupations')
@ApiTags('Staff occupations')
export class StaffOccupationsController {
  constructor(private readonly staffOccupationsService: StaffOccupationsService) {}

  @Get()
  findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Page<StaffOccupationDto> {
    const foundStaffOccupationsPage = this.staffOccupationsService.findMany(paginationQueryDto);
    const items = foundStaffOccupationsPage.items.map(StaffOccupationDto.fromEntity);

    return { ...foundStaffOccupationsPage, items };
  }
}
