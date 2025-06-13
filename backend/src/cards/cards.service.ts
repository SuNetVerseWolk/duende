import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cards } from 'generated/prisma';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: Cards, userId: string) {
    if (createCardDto.id_set) {
      await this.verifySetOwnership(createCardDto.id_set, userId);
    }

    const card = await this.prisma.cards.create({
      data: {
        text: createCardDto.text,
        translation: createCardDto.translation,
        id_set: createCardDto.id_set,
      },
    });

    // Quick fix: Convert BigInt to string manually
    return JSON.parse(
      JSON.stringify(card, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }

  async findAllForSet(setId: bigint, userId?: string) {
    const where: any = { id_set: setId };

    if (userId) {
      where.Sets = {
        OR: [{ privacy: false }, { id_profile: userId }],
      };
    } else {
      where.Sets = { privacy: false };
    }
    console.log('getting all cards');

    return this.prisma.cards
      .findMany({
        where,
        include: {
          Sets: {
            select: {
              id: true,
              name: true,
              privacy: true,
            },
          },
        },
      })
      .then((cards) =>
        cards.map((card) => ({
          ...card,
          id: card.id.toString(),
          Sets: { ...card.Sets, id: card.Sets?.id.toString() },
        })),
      );
  }

  async findOne(id: bigint, userId?: string) {
    const card = await this.prisma.cards.findUnique({
      where: { id },
      include: {
        Sets: {
          select: {
            id: true,
            id_profile: true,
            privacy: true,
          },
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.Sets?.privacy && card.Sets.id_profile !== userId) {
      throw new ForbiddenException('You do not have access to this card');
    }

    return card;
  }

  async update(id: bigint, updateCardDto: Cards, userId: string) {
    const card = await this.findOne(id, userId);

    if (card.Sets?.id_profile !== userId) {
      throw new ForbiddenException(
        'You can only update cards in your own sets',
      );
    }

    return this.prisma.cards.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async remove(id: bigint, userId: string) {
    const card = await this.findOne(id, userId);

    if (card.Sets?.id_profile !== userId) {
      throw new ForbiddenException(
        'You can only delete cards in your own sets',
      );
    }

    return this.prisma.cards.delete({
      where: { id },
    });
  }

  private async verifySetOwnership(setId: bigint, userId: string) {
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
  }
}
