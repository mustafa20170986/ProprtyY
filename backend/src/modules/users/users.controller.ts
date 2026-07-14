import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':clerkId')
  getByClerkId(@Param('clerkId') clerkId: string) {
    return this.usersService.findByClerkId(clerkId);
  }

  @Put(':clerkId')
  updateProfile(@Param('clerkId') clerkId: string, @Body() data: any) {
    return this.usersService.updateProfile(clerkId, data);
  }

  @Put(':id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(id, body.role);
  }
}
