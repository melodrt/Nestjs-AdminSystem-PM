import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';

@Controller('projects/:projectId/members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get()
  async getMembers(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectMembersService.getProjectMembers(projectId);
  }

  @Post()
  async addMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() addMemberDto: { userId: number; role?: string },
  ) {
    return this.projectMembersService.addMember(
      projectId,
      addMemberDto.userId,
      addMemberDto.role || 'member',
    );
  }

  @Put(':userId')
  async updateMemberRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateDto: { role: string },
  ) {
    return this.projectMembersService.updateMemberRole(
      projectId,
      userId,
      updateDto.role,
    );
  }

  @Delete(':userId')
  async removeMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.projectMembersService.removeMember(projectId, userId);
    return { message: 'Miembro eliminado exitosamente' };
  }
}
