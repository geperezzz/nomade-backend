import { createZodDto } from 'nestjs-zod';
import { orderPackageSchema } from './order-package.dto';

export const createOrderPackageSchema = orderPackageSchema;

export class CreateOrderPackageDto extends createZodDto(createOrderPackageSchema) {}
