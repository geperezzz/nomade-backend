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

import { OrderServicesService } from './order-services.service';
import { CreateOrderServiceDto } from './dtos/create-order-service.dto';
import { UpdateOrderServiceDto } from './dtos/update-order-service.dto';
import { OrderServiceDto } from './dtos/order-service.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';

@Controller('orders/:orderId/services')
@ApiTags('Orders\' services')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
  StaffOccupationName.SALESPERSON,
)
export class OrderServicesController {
  constructor(private readonly orderServicesService: OrderServicesService) {}

  @Post()
  async create(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createOrderServiceDto: CreateOrderServiceDto,
  ): Promise<OrderServiceDto> {
    const createdOrderService =
      await this.orderServicesService.create(orderId, createOrderServiceDto);
    return OrderServiceDto.fromEntity(createdOrderService);
  }

  @Get()
  async findMany(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderServiceDto>> {
    const foundOrderServicesPage =
      await this.orderServicesService.findMany(orderId, paginationQueryDto);
    const items = foundOrderServicesPage.items.map(OrderServiceDto.fromEntity);

    return { ...foundOrderServicesPage, items };
  }

  @Get(':serviceId')
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<OrderServiceDto> {
    const foundOrderService = await this.orderServicesService.findOne(orderId, serviceId);

    if (!foundOrderService) {
      throw new NotFoundException(
        'Order service not found',
        `There is no Order with ID ${orderId} that has a service with ID ${serviceId}`,
      );
    }
    return OrderServiceDto.fromEntity(foundOrderService);
  }

  @Patch(':serviceId')
  async update(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() updateOrderServiceDto: UpdateOrderServiceDto,
  ): Promise<OrderServiceDto> {
    const updatedOrderService = await this.orderServicesService.update(
      orderId,
      serviceId,
      updateOrderServiceDto,
    );
    return OrderServiceDto.fromEntity(updatedOrderService);
  }

  @Delete(':serviceId')
  async remove(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<OrderServiceDto> {
    const removedOrderService = await this.orderServicesService.remove(orderId, serviceId);
    return OrderServiceDto.fromEntity(removedOrderService);
  }
}
