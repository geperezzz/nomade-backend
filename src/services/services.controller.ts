import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ServiceDto } from './dtos/service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { ServicesService } from './services.service';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('services')
@ApiTags('Services')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
  StaffOccupationName.SALESPERSON,
)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<ServiceDto>> {
    const foundServicesPage =
      await this.servicesService.findMany(paginationQueryDto);
    const items = foundServicesPage.items.map(
      ServiceDto.fromEntity,
    );

    return { ...foundServicesPage, items };
  }
}
