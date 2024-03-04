import { createZodDto } from 'nestjs-zod';

import { createCustomerSchema } from './create-customer.dto';
import { CustomerEntity } from '../entities/customer.entity';

export const customerSchema = createCustomerSchema.required();

export class CustomerDto extends createZodDto(customerSchema) {
  static fromEntity(entity: CustomerEntity): CustomerDto {
    return customerSchema.parse(entity);
  }
}
