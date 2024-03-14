import { createZodDto } from 'nestjs-zod';

import { createOrderSchema } from './create-order.dto';

export const replaceOrderSchema = createOrderSchema;

export class ReplaceOrderDto extends createZodDto(replaceOrderSchema) {}
