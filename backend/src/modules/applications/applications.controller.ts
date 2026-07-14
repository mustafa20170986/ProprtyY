import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private service: ApplicationsService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() body: { note: string }) {
    return this.service.reject(id, body.note);
  }
}
