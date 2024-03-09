import { createZodDto } from 'nestjs-zod';

import { createPaymentMethodSchema } from './create-payment-method.dto';

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

export class UpdatePaymentMethodDto extends createZodDto(updatePaymentMethodSchema) {}
