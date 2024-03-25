import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginInputDto } from './dtos/login-input.dto';
import { NoLoginRequired } from './no-login-required.decorator';
import { LoginOutputDto, loginOutputSchema } from './dtos/login-output.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authenticationService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @NoLoginRequired()
  async login(@Body() loginInputDto: LoginInputDto): Promise<LoginOutputDto> {
    const loginOutput = await this.authenticationService.login(loginInputDto);
    return loginOutputSchema.parse(loginOutput);
  }
}
