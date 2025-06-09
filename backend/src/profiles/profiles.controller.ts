import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { profiles } from 'generated/prisma';

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
  updateMyProfile(@Param('id') id, @Body() updateProfileDto: profiles) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Get('me/:id/sets')
  getMySets(@Param('id') id) {
    return this.profilesService.getUserSets(id, true);
  }

  @Get(':id/sets')
  getUserSets(@Param('userId') userId: string) {
    return this.profilesService.findById(userId).then(profile => 
      this.profilesService.getUserSets(profile.id)
    );
  }
}