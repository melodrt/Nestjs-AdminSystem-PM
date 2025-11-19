import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('workspaces/:workspaceId')
  async getWorkspaceStats(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.analyticsService.getWorkspaceStats(workspaceId);
  }

  @Get('projects/:projectId')
  async getProjectStats(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.analyticsService.getProjectStats(projectId);
  }
}
