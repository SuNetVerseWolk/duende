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

  @Post(':userId')
  async create(@Param('userId') userId: string, @Body() createSetDto: Sets) {
    return this.setsService.create(createSetDto, userId);
  }

  @Get()
  async findAll() {
		console.log('here?')
    return this.setsService.findAll();
  }

  @Get(':userId/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: bigint,
		@Param('userId') userId: string
  ) {
    try {
			const data = await this.setsService.findOne(id, userId);

      return {...data, id: data.id.toString()};
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

  @Patch(':userId/:id')
  async update(
    @Param('id', ParseIntPipe) id: bigint,
    @Param('userId') userId: string,
    @Body() updateSetDto: Sets
  ) {
    try {
      return await this.setsService.update(id, updateSetDto, userId);
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

  @Delete(':userId/:id')
  async remove(
    @Param('id', ParseIntPipe) id: bigint,
    @Param('userId') userId: string
  ) {
    try {
      return await this.setsService.remove(id, userId);
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
    @Param('userId') userId: string
  ) {
    return this.setsService.findAll(userId);
  }
}