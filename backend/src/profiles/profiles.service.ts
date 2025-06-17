import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { profiles } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  private supabase: SupabaseClient;
  constructor(private prisma: PrismaService) {
		this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
	}

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
				id_profile: set.id_profile?.toString(),
        Cards: set.Cards.map((card) => ({ ...card, id: card.id.toString(), id_set: card.id_set?.toString() })),
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

  async updateProfile(
    id: string,
    updateData: profiles,
    imageFile?: Express.Multer.File,
  ): Promise<profiles> {
    const existingProfile = await this.findById(id);
		console.log(typeof updateData, updateData)

    let imageUrl = existingProfile.avatar;

    if (imageFile) {
      // Upload new image first (better to have the new image before deleting the old one)
      imageUrl = await this.uploadImageToStorage(id, imageFile);

      // Delete old image if exists (only after successful upload)
      if (existingProfile.avatar) {
        try {
          await this.deleteImageFromStorage(existingProfile.avatar);
        } catch (error) {
          console.error('Failed to delete old image:', error);
          // Don't fail the whole operation if deletion fails
        }
      }
    }

    return this.prisma.profiles.update({
      where: { id },
      data: {
        name: updateData.name,
        avatar: imageUrl,
        updated_at: new Date(),
      },
    });
  }

  private async uploadImageToStorage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const sanitizedOriginal = file.originalname
      .replace(/[^a-zA-Z0-9-_.]/g, '_') // Replace invalid characters with underscores
      .replace(/_+/g, '_'); // Collapse multiple underscores

    const filePath = `${userId}-${Date.now()}-${sanitizedOriginal}`;

    const { error } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const {
      data: { publicUrl },
    } = this.supabase.storage.from('avatars').getPublicUrl(filePath);

    return publicUrl;
  }

  private async deleteImageFromStorage(imageUrl: string): Promise<void> {
    try {
      // Extract just the file path after '/avatars/'
      const filePath = imageUrl.split('/avatars/')[1];

      if (!filePath) {
        throw new Error('Could not extract file path from URL');
      }

      console.log(`Attempting to delete: ${filePath}`); // Debug log

      const { error } = await this.supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      console.log(`Successfully deleted: ${filePath}`); // Debug log
    } catch (error) {
      console.error('Deletion error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
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
