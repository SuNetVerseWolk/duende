import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { profiles } from 'generated/prisma';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const profile = await this.prisma.profiles.findUnique({
      where: { id },
      include: {
        _count: {
          select: { Sets: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async findByUsername(username: string) {
    const profile = await this.prisma.profiles.findUnique({
      where: { username },
      include: {
        _count: {
          select: { Sets: true },
        },
        Sets: {
          where: { privacy: false },
          select: {
            id: true,
            name: true,
            description: true,
            created_at: true,
            _count: {
              select: { Cards: true },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(id: string, updateProfileDto: profiles) {
    return this.prisma.profiles.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async getUserSets(userId: string, includePrivate = false) {
    const where: any = { id_profile: userId };
    if (!includePrivate) {
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
}