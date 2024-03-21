import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { NoLoginRequired } from './no-login-required.decorator';
import { TokenDto, tokenSchema } from './dtos/token.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authenticationService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @NoLoginRequired()
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<TokenDto> {
    const token = await this.authenticationService.login(loginDto); 
    return tokenSchema.parse({ token });
  }
}