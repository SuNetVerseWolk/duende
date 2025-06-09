import { Injectable, NotFoundException } from '@nestjs/common';
import { profiles } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getAllProfiles() {
    const profiles = await this.prisma.profiles.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        Sets: {
          orderBy: {
            name: 'asc',
          },
          include: {
            Cards: true,
            _count: { select: { Cards: true } },
          },
          where: {
            privacy: false,
          },
        },
        _count: {
          select: { Sets: true },
        },
      },
    });

    return profiles.map((profile) => ({
      ...profile,
      Sets: profile.Sets.map((set) => ({
        ...set,
        id: set.id.toString(),
        Cards: set.Cards.map((card) => ({ ...card, id: card.id.toString() })),
      })),
    }));
  }

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

    const sets = await this.prisma.sets.findMany({
      where,
      include: {
        _count: {
          select: { Cards: true },
        },
      },
    });

    return sets.map((set) => ({
      ...set,
      id: set.id.toString(),
    }));
  }

  async getProfileWithSetsAndCards(id: string, includePrivate = false) {
    const where: any = { id_profile: id };
    if (!includePrivate) {
      where.privacy = false;
    }

    const profile = await this.prisma.profiles.findUnique({
      where: { id },
      include: {
        Sets: {
          where,
          include: {
            Cards: true,
            _count: {
              select: { Cards: true },
            },
          },
        },
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
}
