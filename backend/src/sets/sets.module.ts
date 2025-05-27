import { Module } from '@nestjs/common';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [PrismaModule, CardsModule],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetsModule {}