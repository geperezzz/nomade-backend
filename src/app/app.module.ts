import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { validate } from './app.config';
import { CustomersModule } from 'src/customers/customers.module';
import { SuccessfulResponseBuilderInterceptor } from 'src/common/successful-response-builder.interceptor';
import { ServicesModule } from 'src/services/services.module';
import { PackagesModule } from 'src/packages/packages.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService, 
          }),
          enableTransactionProxy: true,
        }),
      ],
      global: true,
      middleware: { mount: true },
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
