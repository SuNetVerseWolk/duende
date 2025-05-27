import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SetsService } from './sets.service';
import { Sets } from 'generated/prisma';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  async create(@Body() createSetDto: Sets, @Req() req) {
    return this.setsService.create(createSetDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req?: any) {
    return this.setsService.findAll(req?.user?.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: bigint,
    @Req() req?: any,
  ) {
    try {
      return await this.setsService.findOne(id, req?.user?.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Set not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You do not have access to this set');
      }
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() updateSetDto: Sets,
    @Req() req,
  ) {
    try {
      return await this.setsService.update(id, updateSetDto, req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Set not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You do not own this set');
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: bigint,
    @Req() req,
  ) {
    try {
      return await this.setsService.remove(id, req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Set not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You do not own this set');
      }
      throw error;
    }
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('includePrivate') includePrivate: boolean,
    @Req() req?: any,
  ) {
    // Only allow viewing private sets if the requesting user is the owner
    const allowPrivate = req?.user?.id === userId;
    return this.setsService.findAll(allowPrivate ? userId : undefined);
  }
}