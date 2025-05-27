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

  @Post()
  create(@Body() createCardDto: Cards, @Req() req) {
    return this.cardsService.create(createCardDto, req.user.id);
  }

  @Get('set/:setId')
  findAllForSet(
    @Param('setId', ParseIntPipe) setId: bigint,
    @Req() req?,
  ) {
    return this.cardsService.findAllForSet(setId, req?.user?.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: bigint, @Req() req?) {
    return this.cardsService.findOne(id, req?.user?.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() updateCardDto: Cards,
    @Req() req,
  ) {
    return this.cardsService.update(id, updateCardDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: bigint, @Req() req) {
    return this.cardsService.remove(id, req.user.id);
  }
}