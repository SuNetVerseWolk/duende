import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CardsModule } from './cards/cards.module';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesModule } from './profiles/profiles.module';
import { SetsService } from './sets/sets.service';
import { SetsModule } from './sets/sets.module';

@Module({
  imports: [PrismaModule, CardsModule, ProfilesModule, SetsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProfilesService, SetsService],
})
export class AppModule {}
