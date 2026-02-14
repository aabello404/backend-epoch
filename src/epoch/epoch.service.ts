import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DtoObject } from './epoch.controller';

@Injectable()
export class EpochService {
  constructor(private readonly prismaService: PrismaService) {}
  CreateLike(user: any, dto: DtoObject) {
    return this.prismaService.CreateLike(user, dto.id);
  }

  RemoveLike(user: any, dto: DtoObject) {
    return this.prismaService.RemoveLike(user, dto.id);
  }
}
