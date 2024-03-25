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

import { AirlineTicketsService } from './airline-tickets.service';
import { CreateAirlineTicketDto } from './dtos/create-airline-ticket.dto';
import { UpdateAirlineTicketDto } from './dtos/update-airline-ticket.dto';
import { AirlineTicketDto } from './dtos/airline-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('services/airline-tickets')
@ApiTags('Airline tickets')
@MustBeLoggedInAs(StaffOccupationName.SUPER_ADMIN, StaffOccupationName.ADMIN)
export class AirlineTicketsController {
  constructor(private readonly airlineTicketsService: AirlineTicketsService) {}

  @Post()
  async create(
    @Body() createAirlineTicketDto: CreateAirlineTicketDto,
  ): Promise<AirlineTicketDto> {
    const createdAirlineTicket = await this.airlineTicketsService.create(
      createAirlineTicketDto,
    );
    return AirlineTicketDto.fromEntity(createdAirlineTicket);
  }

  @Get()
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<AirlineTicketDto>> {
    const foundAirlineTicketsPage =
      await this.airlineTicketsService.findMany(paginationQueryDto);
    const items = foundAirlineTicketsPage.items.map(
      AirlineTicketDto.fromEntity,
    );

    return { ...foundAirlineTicketsPage, items };
  }

  @Get(':id')
  @MustBeLoggedInAs(StaffOccupationName.SALESPERSON)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AirlineTicketDto> {
    const foundAirlineTicket = await this.airlineTicketsService.findOne(id);

    if (!foundAirlineTicket) {
      throw new NotFoundException(
        'Airline ticket service not found',
        `There is no airline ticket service with ID ${id}`,
      );
    }
    return AirlineTicketDto.fromEntity(foundAirlineTicket);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAirlineTicketDto: UpdateAirlineTicketDto,
  ): Promise<AirlineTicketDto> {
    const updatedAirlineTicket = await this.airlineTicketsService.update(
      id,
      updateAirlineTicketDto,
    );
    return AirlineTicketDto.fromEntity(updatedAirlineTicket);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AirlineTicketDto> {
    const removedAirlineTicket = await this.airlineTicketsService.remove(id);
    return AirlineTicketDto.fromEntity(removedAirlineTicket);
  }
}
