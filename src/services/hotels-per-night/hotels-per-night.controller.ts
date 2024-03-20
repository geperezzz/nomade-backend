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
import { HotelPerNightDto } from './dtos/hotel-per-night.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('services/hotels-per-night')
@ApiTags('Hotels per night')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
)
export class HotelsPerNightController {
  constructor(private readonly hotelsPerNightService: HotelsPerNightService) {}

  @Post()
  async create(
    @Body() createHotelPerNightDto: CreateHotelPerNightDto,
  ): Promise<HotelPerNightDto> {
    const createdHotelPerNight = await this.hotelsPerNightService.create(
      createHotelPerNightDto,
    );
    return HotelPerNightDto.fromEntity(createdHotelPerNight);
  }

  @Get()
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<HotelPerNightDto>> {
    const foundHotelsPerNightPage =
      await this.hotelsPerNightService.findMany(paginationQueryDto);
    const items = foundHotelsPerNightPage.items.map(
      HotelPerNightDto.fromEntity,
    );

    return { ...foundHotelsPerNightPage, items };
  }

  @Get(':id')
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
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
    return HotelPerNightDto.fromEntity(foundHotelPerNight);
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
    return HotelPerNightDto.fromEntity(updatedHotelPerNight);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HotelPerNightDto> {
    const removedHotelPerNight = await this.hotelsPerNightService.remove(id);
    return HotelPerNightDto.fromEntity(removedHotelPerNight);
  }
}
