import {
  Controller,
  Get,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
	Query,
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

  @Put('me/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMyProfile(
    @Param('id') id,
    @Body() body: profiles,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.profilesService.updateProfile(id, body, avatar);
  }

  @Get('me/:id/sets')
  getMySets(@Param('id') id) {
    return this.profilesService.getUserSets(id, true);
  }

  @Get(':id/sets/privacy/:privacy')
  getUserSets(
    @Param('id') id,
		@Param('privacy') privacy
  ) {
		console.log(privacy)
    return this.profilesService.getUserSets(id, privacy);
  }
}
