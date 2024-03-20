import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AvailableOccupationsService } from './available-occupations.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { AvailableOccupationDto } from './dtos/available-occupation.dto';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from '../entities/employee.entity';

@Controller('staff/occupations')
@ApiTags('Available occupations')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
)
export class AvailableOccupationsController {
  constructor(private readonly availableOccupationsService: AvailableOccupationsService) {}

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<AvailableOccupationDto>> {
    const foundOccupationsPage = await this.availableOccupationsService.findMany(paginationQueryDto);
    const items = foundOccupationsPage.items.map(AvailableOccupationDto.fromEntity);

    return { ...foundOccupationsPage, items };
  }
}
