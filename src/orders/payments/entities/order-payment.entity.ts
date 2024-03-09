import { Payment as PaymentModel, PaymentMethod as PrismaPaymentMethod } from '@prisma/client';

export type OrderPaymentEntity = Omit<PaymentModel, 'orderId'>;

export type PaymentMethod = PrismaPaymentMethod;
