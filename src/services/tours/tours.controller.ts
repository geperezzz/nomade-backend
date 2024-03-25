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

import { ToursService } from './tours.service';
import { CreateTourDto } from './dtos/create-tour.dto';
import { UpdateTourDto } from './dtos/update-tour.dto';
import { TourDto } from './dtos/tour.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('services/tours')
@ApiTags('Tours')
@MustBeLoggedInAs(StaffOccupationName.SUPER_ADMIN, StaffOccupationName.ADMIN)
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  async create(@Body() createTourDto: CreateTourDto): Promise<TourDto> {
    const createdTour = await this.toursService.create(createTourDto);
    return TourDto.fromEntity(createdTour);
  }

  @Get()
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<TourDto>> {
    const foundToursPage = await this.toursService.findMany(paginationQueryDto);
    const items = foundToursPage.items.map(TourDto.fromEntity);

    return { ...foundToursPage, items };
  }

  @Get(':id')
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TourDto> {
    const foundTour = await this.toursService.findOne(id);

    if (!foundTour) {
      throw new NotFoundException(
        'Tour service not found',
        `There is no tour service with ID ${id}`,
      );
    }
    return TourDto.fromEntity(foundTour);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTourDto: UpdateTourDto,
  ): Promise<TourDto> {
    const updatedTour = await this.toursService.update(id, updateTourDto);
    return TourDto.fromEntity(updatedTour);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<TourDto> {
    const removedTour = await this.toursService.remove(id);
    return TourDto.fromEntity(removedTour);
  }
}
