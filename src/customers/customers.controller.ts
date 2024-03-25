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
import { CustomerDto } from './dtos/customer.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { MustBeLoggedInAs } from 'src/auth/must-be-logged-in-as.decorator';
import { StaffOccupationName } from 'src/staff/entities/employee.entity';

@Controller('customers')
@ApiTags('Customers')
@MustBeLoggedInAs(
  StaffOccupationName.SUPER_ADMIN,
  StaffOccupationName.ADMIN,
  StaffOccupationName.SALESPERSON,
)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    const createdCustomer =
      await this.customersService.create(createCustomerDto);
    return CustomerDto.fromEntity(createdCustomer);
  }

  @Get()
  async findMany(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<CustomerDto>> {
    const foundCustomersPage =
      await this.customersService.findMany(paginationQueryDto);
    const items = foundCustomersPage.items.map(CustomerDto.fromEntity);

    return { ...foundCustomersPage, items };
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<CustomerDto> {
    const foundCustomer = await this.customersService.findOneByEmail(email);

    if (!foundCustomer) {
      throw new NotFoundException(
        'Customer not found',
        `There is no Customer with email ${email}`,
      );
    }
    return CustomerDto.fromEntity(foundCustomer);
  }

  @Get('dni/:dni')
  async findOneByDni(@Param('dni') dni: string): Promise<CustomerDto> {
    const foundCustomer = await this.customersService.findOneByDni(dni);

    if (!foundCustomer) {
      throw new NotFoundException(
        'Customer not found',
        `There is no Customer with DNI ${dni}`,
      );
    }
    return CustomerDto.fromEntity(foundCustomer);
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
    return CustomerDto.fromEntity(foundCustomer);
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
    return CustomerDto.fromEntity(updatedCustomer);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<CustomerDto> {
    const removedCustomer = await this.customersService.remove(id);
    return CustomerDto.fromEntity(removedCustomer);
  }
}
