import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from 'generated/prisma';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() createCardDto: Cards) {
    return this.cardsService.create(createCardDto, userId);
  }

  @Get('set/:setId/by/:userId')
  findAllForSet(
    @Param('setId', ParseIntPipe) setId: bigint,
    @Param('userId') userId: string
  ) {
    return this.cardsService.findAllForSet(setId, userId);
  }

  @Get(':id/by/:userId')
  findOne(@Param('id', ParseIntPipe) id: bigint, @Param('userId') userId: string) {
    return this.cardsService.findOne(id, userId);
  }

  @Patch(':id/by/:userId')
  update(
    @Param('id', ParseIntPipe) id: bigint,
    @Param('userId') userId: string,
    @Body() updateCardDto: Cards
  ) {
    return this.cardsService.update(id, updateCardDto, userId);
  }

  @Delete(':id/by/:userId')
  remove(@Param('id', ParseIntPipe) id: bigint, @Param('userId') userId: string) {
    return this.cardsService.remove(id, userId);
  }
}