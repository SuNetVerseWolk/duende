import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sets } from 'generated/prisma';

@Injectable()
export class SetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSetDto: Sets, userId: string) {
    const set = await this.prisma.sets.create({
      data: {
        name: createSetDto.name,
        description: createSetDto.description,
        privacy: createSetDto.privacy,
        id_profile: userId,
      },
    });

    return {
      ...set,
      id: set.id.toString(), // Convert BigInt to string
    };
  }

  async findAll(userId?: string) {
    const where: any = {};

    if (userId) {
      where.OR = [{ privacy: false }, { id_profile: userId }];
    } else {
      where.privacy = false;
    }

    return this.prisma.sets.findMany({
      where,
      include: {
        _count: {
          select: { Cards: true },
        },
      },
    });
  }

  async findOne(id: bigint, userId?: string) {
    const set = await this.prisma.sets.findUnique({
      where: { id },
      include: {
        _count: {
          select: { Cards: true },
        },
      },
    });

    if (!set) {
      throw new NotFoundException('Set not found');
    }

    if (set.privacy && set.id_profile !== userId) {
      throw new ForbiddenException('You do not have access to this set');
    }

    return set;
  }

  async update(id: bigint, updateSetDto: Sets, userId: string) {
    const set = await this.verifyOwnership(id, userId);

    return this.prisma.sets.update({
      where: { id },
      data: updateSetDto,
    });
  }

  async remove(id: bigint, userId: string) {
    await this.verifyOwnership(id, userId);

    return this.prisma.sets.delete({
      where: { id },
    });
  }

  private async verifyOwnership(setId: bigint, userId: string) {
    const set = await this.prisma.sets.findUnique({
      where: { id: setId },
      select: { id_profile: true },
    });

    if (!set) {
      throw new NotFoundException('Set not found');
    }

    if (set.id_profile !== userId) {
      throw new ForbiddenException('You do not own this set');
    }

    return set;
  }
}
