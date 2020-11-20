import {
  Body, Controller, HttpCode, HttpStatus, Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { TokenDto } from './dtos/token.dto';

@Controller('/auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  public async login(@Body() credentials: CredentialsDto): Promise<TokenDto> {
    const result = await this.authService.login(credentials.username, credentials.password);

    return result;
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() credentials: CredentialsDto): Promise<void> {
    await this.authService.register(credentials.username, credentials.password);
  }
}
