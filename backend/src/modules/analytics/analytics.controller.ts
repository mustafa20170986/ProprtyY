import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('agent/:ownerId')
  getAgentStats(@Param('ownerId') ownerId: string) {
    return this.analyticsService.getAgentStats(ownerId);
  }

  @Get('admin')
  getAdminStats() {
    return this.analyticsService.getAdminStats();
  }
}
