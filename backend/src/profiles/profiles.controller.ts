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

  @Get('me')
  getMyProfile(@Req() req) {
    return this.profilesService.findById(req.user.id);
  }

  @Patch('me')
  updateMyProfile(@Req() req, @Body() updateProfileDto: profiles) {
    return this.profilesService.update(req.user.id, updateProfileDto);
  }

  @Get('me/sets')
  getMySets(@Req() req) {
    return this.profilesService.getUserSets(req.user.id, true);
  }

  @Get(':id/sets')
  getUserSets(@Param('userId') userId: string) {
    return this.profilesService.findById(userId).then(profile => 
      this.profilesService.getUserSets(profile.id)
    );
  }
}