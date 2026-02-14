import { Controller, Request, Body, Put, Delete } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EpochService } from './epoch.service';
export interface DtoObject {
  id: number;
}
@Controller('epoch')
export class EpochController {
  constructor(private readonly epochService: EpochService) {}
  @Put('like')
  CreateLike(@Request() req: any, @Body() dto: DtoObject) {
    //console.log(req.user, dto,"like");
    return this.epochService.CreateLike(req.user, dto);
  }
  @Delete('removelike')
  RemoveLike(@Request() req: any, @Body() dto: DtoObject) {
    //console.log(req.user, dto,"unlike");
    return this.epochService.RemoveLike(req.user, dto);
  }
}
