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

import { CarRentalsService } from './car-rentals.service';
import { CreateCarRentalDto } from './dtos/create-car-rental.dto';
import { UpdateCarRentalDto } from './dtos/update-car-rental.dto';
import { CarRentalDto } from './dtos/car-rental.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('services/car-rentals')
@ApiTags('Car rentals')
export class CarRentalsController {
  constructor(private readonly hotelsPerNightService: CarRentalsService) {}

  @Post()
  async create(
    @Body() createCarRentalDto: CreateCarRentalDto,
  ): Promise<CarRentalDto> {
    const createdCarRental = await this.hotelsPerNightService.create(
      createCarRentalDto,
    );
    return CarRentalDto.fromEntity(createdCarRental);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<CarRentalDto>> {
    const foundHotelsPerNightPage =
      await this.hotelsPerNightService.findMany(paginationQueryDto);
    const items = foundHotelsPerNightPage.items.map(
      CarRentalDto.fromEntity,
    );

    return { ...foundHotelsPerNightPage, items };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CarRentalDto> {
    const foundCarRental = await this.hotelsPerNightService.findOne(id);

    if (!foundCarRental) {
      throw new NotFoundException(
        'Hotel per night service not found',
        `There is no hotel per night service with ID ${id}`,
      );
    }
    return CarRentalDto.fromEntity(foundCarRental);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarRentalDto: UpdateCarRentalDto,
  ): Promise<CarRentalDto> {
    const updatedCarRental = await this.hotelsPerNightService.update(
      id,
      updateCarRentalDto,
    );
    return CarRentalDto.fromEntity(updatedCarRental);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CarRentalDto> {
    const removedCarRental = await this.hotelsPerNightService.remove(id);
    return CarRentalDto.fromEntity(removedCarRental);
  }
}
