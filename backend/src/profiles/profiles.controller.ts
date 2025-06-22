import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { profiles } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('all')
  getAllProfiles() {
    return this.profilesService.getAllProfiles();
  }

  @Get('me/:id')
  getMyProfile(@Param('id') id) {
    return this.profilesService.findById(id);
  }

  @Patch('me/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateMyProfile(
    @Param('id') id,
    @Body() updateProfileDto: profiles,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.profilesService.updateProfile(id, updateProfileDto, avatar);
  }

  @Get('me/:id/sets')
  getMySets(@Param('id') id) {
    return this.profilesService.getUserSets(id, true);
  }

  @Get(':id/sets')
  getUserSets(@Param('userId') userId: string) {
    return this.profilesService.getUserSets(userId, false);
  }
}
