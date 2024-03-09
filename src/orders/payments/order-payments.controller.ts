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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderPaymentsService } from './order-payments.service';
import { CreateOrderPaymentDto } from './dtos/create-order-payment.dto';
import { UpdateOrderPaymentDto } from './dtos/update-order-payment.dto';
import { OrderPaymentDto } from './dtos/order-payment.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('orders/:orderId/payments')
@ApiTags('Orders\' payments')
export class OrderPaymentsController {
  constructor(private readonly orderPaymentsService: OrderPaymentsService) {}

  @Post()
  async create(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createOrderServiceDto: CreateOrderPaymentDto,
  ): Promise<OrderPaymentDto> {
    const createdOrderService =
      await this.orderPaymentsService.create(orderId, createOrderServiceDto);
    return OrderPaymentDto.fromEntity(createdOrderService);
  }

  @Get()
  async findMany(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderPaymentDto>> {
    const foundOrderPaymentsPage =
      await this.orderPaymentsService.findMany(orderId, paginationQueryDto);
    const items = foundOrderPaymentsPage.items.map(OrderPaymentDto.fromEntity);

    return { ...foundOrderPaymentsPage, items };
  }

  @Get(':paymentNumber')
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('paymentNumber', ParseIntPipe) paymentNumber: number,
  ): Promise<OrderPaymentDto> {
    const foundOrderService = await this.orderPaymentsService.findOne(orderId, paymentNumber);

    if (!foundOrderService) {
      throw new NotFoundException(
        'Order payment not found',
        `There is no Order with ID ${orderId} that has a payment with ID ${paymentNumber}`,
      );
    }
    return OrderPaymentDto.fromEntity(foundOrderService);
  }

  @Patch(':paymentNumber')
  async update(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('paymentNumber', ParseIntPipe) paymentNumber: number,
    @Body() updateOrderServiceDto: UpdateOrderPaymentDto,
  ): Promise<OrderPaymentDto> {
    const updatedOrderService = await this.orderPaymentsService.update(
      orderId,
      paymentNumber,
      updateOrderServiceDto,
    );
    return OrderPaymentDto.fromEntity(updatedOrderService);
  }

  @Delete(':paymentNumber')
  async remove(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('paymentNumber', ParseIntPipe) paymentNumber: number,
  ): Promise<OrderPaymentDto> {
    const removedOrderService = await this.orderPaymentsService.remove(orderId, paymentNumber);
    return OrderPaymentDto.fromEntity(removedOrderService);
  }
}
