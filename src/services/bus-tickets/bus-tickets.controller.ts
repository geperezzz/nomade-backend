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

import { BusTicketsService } from './bus-tickets.service';
import { CreateBusTicketDto } from './dtos/create-bus-ticket.dto';
import { UpdateBusTicketDto } from './dtos/update-bus-ticket.dto';
import { BusTicketDto } from './dtos/bus-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('services/bus-tickets')
@ApiTags('Bus tickets')
export class BusTicketsController {
  constructor(private readonly busTicketsService: BusTicketsService) {}

  @Post()
  async create(
    @Body() createBusTicketDto: CreateBusTicketDto,
  ): Promise<BusTicketDto> {
    const createdBusTicket = await this.busTicketsService.create(
      createBusTicketDto,
    );
    return BusTicketDto.fromEntity(createdBusTicket);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<BusTicketDto>> {
    const foundBusTicketsPage =
      await this.busTicketsService.findMany(paginationQueryDto);
    const items = foundBusTicketsPage.items.map(
      BusTicketDto.fromEntity,
    );

    return { ...foundBusTicketsPage, items };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusTicketDto> {
    const foundBusTicket = await this.busTicketsService.findOne(id);

    if (!foundBusTicket) {
      throw new NotFoundException(
        'Bus ticket service not found',
        `There is no bus ticket service with ID ${id}`,
      );
    }
    return BusTicketDto.fromEntity(foundBusTicket);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusTicketDto: UpdateBusTicketDto,
  ): Promise<BusTicketDto> {
    const updatedBusTicket = await this.busTicketsService.update(
      id,
      updateBusTicketDto,
    );
    return BusTicketDto.fromEntity(updatedBusTicket);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusTicketDto> {
    const removedBusTicket = await this.busTicketsService.remove(id);
    return BusTicketDto.fromEntity(removedBusTicket);
  }
}
