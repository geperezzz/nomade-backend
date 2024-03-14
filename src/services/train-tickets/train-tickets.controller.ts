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

import { TrainTicketsService } from './train-tickets.service';
import { CreateTrainTicketDto } from './dtos/create-train-ticket.dto';
import { UpdateTrainTicketDto } from './dtos/update-train-ticket.dto';
import { TrainTicketDto } from './dtos/train-ticket.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('services/train-tickets')
@ApiTags('Train tickets')
export class TrainTicketsController {
  constructor(private readonly trainTicketsService: TrainTicketsService) {}

  @Post()
  async create(
    @Body() createTrainTicketDto: CreateTrainTicketDto,
  ): Promise<TrainTicketDto> {
    const createdTrainTicket = await this.trainTicketsService.create(
      createTrainTicketDto,
    );
    return TrainTicketDto.fromEntity(createdTrainTicket);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<TrainTicketDto>> {
    const foundTrainTicketsPage =
      await this.trainTicketsService.findMany(paginationQueryDto);
    const items = foundTrainTicketsPage.items.map(
      TrainTicketDto.fromEntity,
    );

    return { ...foundTrainTicketsPage, items };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TrainTicketDto> {
    const foundTrainTicket = await this.trainTicketsService.findOne(id);

    if (!foundTrainTicket) {
      throw new NotFoundException(
        'Train ticket service not found',
        `There is no train ticket service with ID ${id}`,
      );
    }
    return TrainTicketDto.fromEntity(foundTrainTicket);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrainTicketDto: UpdateTrainTicketDto,
  ): Promise<TrainTicketDto> {
    const updatedTrainTicket = await this.trainTicketsService.update(
      id,
      updateTrainTicketDto,
    );
    return TrainTicketDto.fromEntity(updatedTrainTicket);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TrainTicketDto> {
    const removedTrainTicket = await this.trainTicketsService.remove(id);
    return TrainTicketDto.fromEntity(removedTrainTicket);
  }
}
