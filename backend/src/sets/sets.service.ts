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

  async findAll(userId?: string, includePrivate: boolean = false) {
    const where: any = {};

    if (userId) {
			console.log(userId)
      where.OR = [includePrivate ? {} : { privacy: false }, { id_profile: userId }];
    } else {
      where.privacy = false;
    }

    const sets = await this.prisma.sets.findMany({
      where,
      include: {
        _count: {
          select: { Cards: true },
        },
        profiles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        profiles: {
          name: 'asc',
        },
      },
    });
		console.log(sets)

    // Filter out sets without profiles and group by profile name
    const groupedResult = sets.reduce(
      (acc, set) => {
        if (!set.profiles?.name) return acc; // Skip sets without profiles

        const profileName = set.profiles.name;
        const profileId = set.profiles.id;

        if (!acc[profileName]) {
          acc[profileName] = {
            profileId,
            profileName,
            sets: [],
          };
        }

        acc[profileName].sets.push(set);
        return acc;
      },
      {} as Record<
        string,
        { profileId: string; profileName: string; sets: any[] }
      >,
    );

    // Convert to array format
    console.log(Object.values(groupedResult));
    return Object.values(groupedResult);
  }

  async findOne(id: bigint, userId?: string) {
    const set = await this.prisma.sets.findUnique({
      where: { id },
      include: {
        Cards: true,
      },
    });

    if (!set) {
      throw new NotFoundException('Set not found');
    }

    if (set.privacy && set.id_profile !== userId) {
      throw new ForbiddenException('You do not have access to this set');
    }

    return {
      ...set,
      id: set.id.toString(),
      Cards: set.Cards.map((card) => ({
        ...card,
        id: card.id.toString(),
        id_set: card.id_set?.toString(),
      })),
    };
  }

  async update(id: bigint, updateSetDto: Sets, userId: string) {
    const set = await this.verifyOwnership(id, userId);

    return this.prisma.sets
      .update({
        where: { id },
        data: updateSetDto,
      })
      .then((sets) => ({ ...sets, id: sets.id.toString() }));
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
