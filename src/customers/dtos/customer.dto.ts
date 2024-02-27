import { createZodDto } from 'nestjs-zod';

import { createCustomerSchema } from './create-customer.dto';

export const customerSchema = createCustomerSchema.required();

export class CustomerDto extends createZodDto(customerSchema) {}
