import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private service: InquiriesService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: string) {
    return this.service.findBySeller(sellerId);
  }

  @Get('buyer/:buyerId')
  findByBuyer(@Param('buyerId') buyerId: string) {
    return this.service.findByBuyer(buyerId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
