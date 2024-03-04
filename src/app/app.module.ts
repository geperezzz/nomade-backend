import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { validate } from './app.config';
import { CustomersModule } from 'src/customers/customers.module';
import { SuccessfulResponseBuilderInterceptor } from 'src/common/successful-response-builder.interceptor';
import { ServicesModule } from 'src/services/services.module';
import { PackagesModule } from 'src/packages/packages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CustomersModule,
    ServicesModule,
    PackagesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessfulResponseBuilderInterceptor,
    },
  ],
})
export class AppModule {}
