import { createZodDto } from 'nestjs-zod';
import { orderServiceSchema } from './order-service.dto';

export const createOrderServiceSchema = orderServiceSchema;

export class CreateOrderServiceDto extends createZodDto(createOrderServiceSchema) {}
