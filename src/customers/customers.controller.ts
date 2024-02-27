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

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { customerSchema, CustomerDto } from './dtos/customer.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.interface';

@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    const createdCustomer =
      await this.customersService.create(createCustomerDto);
    return customerSchema.parse(createdCustomer);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<CustomerDto>> {
    const foundCustomersPage =
      await this.customersService.findMany(paginationQueryDto);
    foundCustomersPage.items.map((customer) => customerSchema.parse(customer));

    return foundCustomersPage;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CustomerDto> {
    const foundCustomer = await this.customersService.findOne(id);

    if (!foundCustomer) {
      throw new NotFoundException(
        'Customer not found',
        `There is no Customer with ID ${id}`,
      );
    }
    return customerSchema.parse(foundCustomer);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const updatedCustomer = await this.customersService.update(
      id,
      updateCustomerDto,
    );
    return customerSchema.parse(updatedCustomer);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<CustomerDto> {
    const removedCustomer = await this.customersService.remove(id);
    return customerSchema.parse(removedCustomer);
  }
}
