import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { UsersService } from '../users/users.service';
import { WorkspaceMember } from '@prisma/client';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspacesService: WorkspacesService,
    private readonly usersService: UsersService,
  ) {}

  async getWorkspaceMembers(workspaceId: number) {
    await this.workspacesService.getWorkspaceById(workspaceId);
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
    });
  }

  async addMember(
    workspaceId: number,
    userId: number,
    role: string = 'member',
  ): Promise<WorkspaceMember> {
    await this.workspacesService.getWorkspaceById(workspaceId);
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El usuario ya es miembro de este workspace');
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
      include: { user: true },
    });
  }

  async removeMember(workspaceId: number, userId: number): Promise<void> {
    await this.workspacesService.getWorkspaceById(workspaceId);
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('El usuario no es miembro de este workspace');
    }

    await this.prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async updateMemberRole(
    workspaceId: number,
    userId: number,
    role: string,
  ): Promise<WorkspaceMember> {
    await this.workspacesService.getWorkspaceById(workspaceId);
    return this.prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: { role },
      include: { user: true },
    });
  }
}
