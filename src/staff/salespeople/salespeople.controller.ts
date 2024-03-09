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

import { SalespeopleService } from './salespeople.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { CreateSalespersonDto } from './dtos/create-salesperson.dto';
import { SalespersonDto } from './dtos/salesperson.dto';

@Controller('staff/salespeople')
@ApiTags('Staff\'s salespeople')
export class SalespeopleController {
  constructor(private readonly salespersonsService: SalespeopleService) {}

  @Post()
  async create(
    @Body() createSalespersonDto: CreateSalespersonDto,
  ): Promise<SalespersonDto> {
    const createdSalesperson =
      await this.salespersonsService.create(createSalespersonDto);
    return SalespersonDto.fromEntity(createdSalesperson);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<SalespersonDto>> {
    const foundSalespeoplePage =
      await this.salespersonsService.findMany(paginationQueryDto);
    const items = foundSalespeoplePage.items.map(SalespersonDto.fromEntity);

    return { ...foundSalespeoplePage, items };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SalespersonDto> {
    const foundSalesperson = await this.salespersonsService.findOne(id);

    if (!foundSalesperson) {
      throw new NotFoundException(
        'Salesperson not found',
        `There is no Salesperson with ID ${id}`,
      );
    }
    return SalespersonDto.fromEntity(foundSalesperson);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<SalespersonDto> {
    const removedSalesperson = await this.salespersonsService.remove(id);
    return SalespersonDto.fromEntity(removedSalesperson);
  }
}
