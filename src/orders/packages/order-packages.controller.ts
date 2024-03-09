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

import { OrderPackagesService } from './order-packages.service';
import { CreateOrderPackageDto } from './dtos/create-order-package.dto';
import { UpdateOrderPackageDto } from './dtos/update-order-package.dto';
import { OrderPackageDto } from './dtos/order-package.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';

@Controller('orders/:orderId/packages')
@ApiTags('Order packages')
export class OrderPackagesController {
  constructor(private readonly orderPackagesService: OrderPackagesService) {}

  @Post()
  async create(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createOrderPackageDto: CreateOrderPackageDto,
  ): Promise<OrderPackageDto> {
    const createdOrderPackage =
      await this.orderPackagesService.create(orderId, createOrderPackageDto);
    return OrderPackageDto.fromEntity(createdOrderPackage);
  }

  @Get()
  async findMany(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderPackageDto>> {
    const foundOrderPackagesPage =
      await this.orderPackagesService.findMany(orderId, paginationQueryDto);
    const items = foundOrderPackagesPage.items.map(OrderPackageDto.fromEntity);

    return { ...foundOrderPackagesPage, items };
  }

  @Get(':packageId')
  async findOne(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('packageId', ParseUUIDPipe) packageId: string,
  ): Promise<OrderPackageDto> {
    const foundOrderPackage = await this.orderPackagesService.findOne(orderId, packageId);

    if (!foundOrderPackage) {
      throw new NotFoundException(
        'Order package not found',
        `There is no Order with ID ${orderId} that has a package with ID ${packageId}`,
      );
    }
    return OrderPackageDto.fromEntity(foundOrderPackage);
  }

  @Patch(':packageId')
  async update(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('packageId', ParseUUIDPipe) packageId: string,
    @Body() updateOrderPackageDto: UpdateOrderPackageDto,
  ): Promise<OrderPackageDto> {
    const updatedOrderPackage = await this.orderPackagesService.update(
      orderId,
      packageId,
      updateOrderPackageDto,
    );
    return OrderPackageDto.fromEntity(updatedOrderPackage);
  }

  @Delete(':packageId')
  async remove(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('packageId', ParseUUIDPipe) packageId: string,
  ): Promise<OrderPackageDto> {
    const removedOrderPackage = await this.orderPackagesService.remove(orderId, packageId);
    return OrderPackageDto.fromEntity(removedOrderPackage);
  }
}
