import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto, @Headers('x-user-id') ownerId: string, @Headers('x-user-role') ownerRole: string) {
    return this.propertiesService.create(dto, ownerId, ownerRole || 'user');
  }

  @Get()
  findAll(@Query() query: any) {
    return this.propertiesService.findAll(query);
  }

  @Get('featured/list')
  featured() {
    return this.propertiesService.featured();
  }

  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.propertiesService.findByOwner(ownerId);
  }

  @Post('compare')
  compare(@Body() body: { ids: string[] }) {
    return this.propertiesService.compare(body.ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto, @Headers('x-user-id') ownerId: string) {
    return this.propertiesService.update(id, dto, ownerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-user-id') ownerId: string) {
    return this.propertiesService.remove(id, ownerId);
  }
}
