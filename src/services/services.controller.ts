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

@Controller('services')
@ApiTags('Services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<ServiceDto>> {
    const foundHotelsPerNightPage =
      await this.servicesService.findMany(paginationQueryDto);
    const items = foundHotelsPerNightPage.items.map(
      ServiceDto.fromEntity,
    );

    return { ...foundHotelsPerNightPage, items };
  }
}
