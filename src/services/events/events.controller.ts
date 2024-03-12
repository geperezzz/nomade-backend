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

import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventDto } from './dtos/event.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('services/events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventDto> {
    const createdEvent = await this.eventsService.create(
      createEventDto,
    );
    return EventDto.fromEntity(createdEvent);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<EventDto>> {
    const foundEventsPage =
      await this.eventsService.findMany(paginationQueryDto);
    const items = foundEventsPage.items.map(
      EventDto.fromEntity,
    );

    return { ...foundEventsPage, items };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventDto> {
    const foundEvent = await this.eventsService.findOne(id);

    if (!foundEvent) {
      throw new NotFoundException(
        'Event service not found',
        `There is no event service with ID ${id}`,
      );
    }
    return EventDto.fromEntity(foundEvent);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventDto> {
    const updatedEvent = await this.eventsService.update(
      id,
      updateEventDto,
    );
    return EventDto.fromEntity(updatedEvent);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventDto> {
    const removedEvent = await this.eventsService.remove(id);
    return EventDto.fromEntity(removedEvent);
  }
}
