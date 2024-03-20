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

import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import { PaymentMethodDto } from './dtos/payment-method.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('payment-methods')
@ApiTags('Payment methods')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodDto> {
    const createdPaymentMethod =
      await this.paymentMethodsService.create(createPaymentMethodDto);
    return PaymentMethodDto.fromEntity(createdPaymentMethod);
  }

  @Get()
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PaymentMethodDto>> {
    const foundPaymentMethodsPage =
      await this.paymentMethodsService.findMany(paginationQueryDto);
    const items = foundPaymentMethodsPage.items.map(PaymentMethodDto.fromEntity);

    return { ...foundPaymentMethodsPage, items };
  }

  @Get(':id')
  @MustBeLoggedInAs(
    StaffOccupationName.SALESPERSON,
  )
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentMethodDto> {
    const foundPaymentMethod = await this.paymentMethodsService.findOne(id);

    if (!foundPaymentMethod) {
      throw new NotFoundException(
        'Payment method not found',
        `There is no Payment method with ID ${id}`,
      );
    }
    return PaymentMethodDto.fromEntity(foundPaymentMethod);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodDto> {
    const updatedPaymentMethod = await this.paymentMethodsService.update(
      id,
      updatePaymentMethodDto,
    );
    return PaymentMethodDto.fromEntity(updatedPaymentMethod);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentMethodDto> {
    const removedPaymentMethod = await this.paymentMethodsService.remove(id);
    return PaymentMethodDto.fromEntity(removedPaymentMethod);
  }
}
