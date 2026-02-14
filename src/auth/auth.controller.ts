import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  createSession(@Body() objUser: Expectedobject): any {
    return this.authService.createSession(objUser);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  createUser(@Body() objUser: ExpectedobjectNew): any {
    return this.authService.createUser(objUser);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

export interface Expectedobject {
  email: string;
  hash: string;
  firstName?: string;
}
export interface ExpectedobjectNew {
  email: string;
  hash: string;
  name: string;
}
