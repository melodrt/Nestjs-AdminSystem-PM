import { Controller, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboardStats(@Request() req) {
    const userId = req.user?.sub;
    return this.analyticsService.getDashboardStats(userId);
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
