import { Body, Controller, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}
}
