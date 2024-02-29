import { createZodDto } from 'nestjs-zod';

import { createCustomerSchema } from './create-customer.dto';

export const updateCustomerSchema = createCustomerSchema.partial();

export class UpdateCustomerDto extends createZodDto(updateCustomerSchema) {}
