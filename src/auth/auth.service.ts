import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Expectedobject, ExpectedobjectNew } from './auth.controller';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  createSession(objUser: Expectedobject): any {
    return this.prismaService.checkUser(objUser);
  }
  createUser(objUser: ExpectedobjectNew): any {
    return this.prismaService.createUser(objUser);
  }
}
