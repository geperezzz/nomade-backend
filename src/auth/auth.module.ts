import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthGuard } from './auth.guard';
import { AuthenticationConfig, validate } from './auth.config';
import { StaffModule } from 'src/staff/staff.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ validate })],
      useFactory: async (
        configService: ConfigService<AuthenticationConfig, true>,
      ) => ({
        secret: configService.get('AUTHENTICATION_TOKEN_SECRET', {
          infer: true,
        }),
        signOptions: {
          expiresIn: configService.get('AUTHENTICATION_TOKEN_EXPIRES_IN', {
            infer: true,
          }),
        },
      }),
      inject: [ConfigService],
    }),
    StaffModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
