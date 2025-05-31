import { Injectable, NotFoundException } from '@nestjs/common';
import { profiles } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getAllProfiles() {
		return this.prisma.profiles.findMany({
			orderBy: {
				name: 'asc', // or 'desc' for descending
			},
			include: {
				_count: {
					select: { Sets: true },
				},
			},
		});
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