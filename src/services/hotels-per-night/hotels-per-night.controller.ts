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

import { HotelsPerNightService } from './hotels-per-night.service';
import { CreateHotelPerNightDto } from './dtos/create-hotel-per-night.dto';
import { UpdateHotelPerNightDto } from './dtos/update-hotel-per-night.dto';
import {
  hotelPerNightSchema,
  HotelPerNightDto,
} from './dtos/hotel-per-night.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.interface';

@Controller('services/hotels-per-night')
@ApiTags('Hotels per night')
export class HotelsPerNightController {
  constructor(private readonly hotelsPerNightService: HotelsPerNightService) {}

  @Post()
  async create(
    @Body() createHotelPerNightDto: CreateHotelPerNightDto,
  ): Promise<HotelPerNightDto> {
    const createdHotelPerNight = await this.hotelsPerNightService.create(
      createHotelPerNightDto,
    );
    return hotelPerNightSchema.parse(createdHotelPerNight);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<HotelPerNightDto>> {
    const foundHotelsPerNightPage =
      await this.hotelsPerNightService.findMany(paginationQueryDto);
    const items = foundHotelsPerNightPage.items.map((hotelPerNight) =>
      hotelPerNightSchema.parse(hotelPerNight),
    );

    return { ...foundHotelsPerNightPage, items };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HotelPerNightDto> {
    const foundHotelPerNight = await this.hotelsPerNightService.findOne(id);

    if (!foundHotelPerNight) {
      throw new NotFoundException(
        'Hotel per night service not found',
        `There is no hotel per night service with ID ${id}`,
      );
    }
    return hotelPerNightSchema.parse(foundHotelPerNight);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelPerNightDto: UpdateHotelPerNightDto,
  ): Promise<HotelPerNightDto> {
    const updatedHotelPerNight = await this.hotelsPerNightService.update(
      id,
      updateHotelPerNightDto,
    );
    return hotelPerNightSchema.parse(updatedHotelPerNight);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HotelPerNightDto> {
    const removedHotelPerNight = await this.hotelsPerNightService.remove(id);
    return hotelPerNightSchema.parse(removedHotelPerNight);
  }
}
