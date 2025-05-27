import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
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

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.profilesService.findByUsername(username);
  }

  @Get(':username/sets')
  getUserSets(@Param('username') username: string) {
    return this.profilesService.findByUsername(username).then(profile => 
      this.profilesService.getUserSets(profile.id)
    );
  }
}