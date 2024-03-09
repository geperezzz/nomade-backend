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

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderDto } from './dtos/order.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    const createdOrder =
      await this.ordersService.create(createOrderDto);
    return OrderDto.fromEntity(createdOrder);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderDto>> {
    const foundOrdersPage =
      await this.ordersService.findMany(paginationQueryDto);
    const items = foundOrdersPage.items.map(OrderDto.fromEntity);

    return { ...foundOrdersPage, items };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderDto> {
    const foundOrder = await this.ordersService.findOne(id);

    if (!foundOrder) {
      throw new NotFoundException(
        'Order not found',
        `There is no Order with ID ${id}`,
      );
    }
    return OrderDto.fromEntity(foundOrder);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    const updatedOrder = await this.ordersService.update(
      id,
      updateOrderDto,
    );
    return OrderDto.fromEntity(updatedOrder);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<OrderDto> {
    const removedOrder = await this.ordersService.remove(id);
    return OrderDto.fromEntity(removedOrder);
  }
}
