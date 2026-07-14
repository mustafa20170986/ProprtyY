import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SavedService } from './saved.service';

@Controller('saved')
export class SavedController {
  constructor(private service: SavedService) {}

  @Post('toggle')
  toggle(@Body() body: { userId: string; propertyId: string }) {
    return this.service.toggle(body.userId, body.propertyId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }
}
