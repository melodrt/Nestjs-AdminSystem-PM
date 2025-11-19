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
import { WorkspaceMembersService } from './workspace-members.service';

@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) {}

  @Get()
  async getMembers(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.workspaceMembersService.getWorkspaceMembers(workspaceId);
  }

  @Post()
  async addMember(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() addMemberDto: { userId: number; role?: string },
  ) {
    return this.workspaceMembersService.addMember(
      workspaceId,
      addMemberDto.userId,
      addMemberDto.role || 'member',
    );
  }

  @Put(':userId')
  async updateMemberRole(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateDto: { role: string },
  ) {
    return this.workspaceMembersService.updateMemberRole(
      workspaceId,
      userId,
      updateDto.role,
    );
  }

  @Delete(':userId')
  async removeMember(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.workspaceMembersService.removeMember(workspaceId, userId);
    return { message: 'Miembro eliminado exitosamente' };
  }
}
