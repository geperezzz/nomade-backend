import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createCustomerSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  dni: z.string(),
  birthdate: z.coerce.date(),
  citizenship: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
});

export class CreateCustomerDto extends createZodDto(createCustomerSchema) {}
