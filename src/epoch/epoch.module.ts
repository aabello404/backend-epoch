import { Module } from '@nestjs/common';
import { EpochController } from './epoch.controller';
import { EpochService } from './epoch.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EpochController],
  providers: [EpochService],
})
export class EpochModule {}
