import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { ProjectMember } from '@prisma/client';

@Injectable()
export class ProjectMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async getProjectMembers(projectId: number) {
    await this.projectsService.getProjectById(projectId);
    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: { user: true },
    });
  }

  async addMember(
    projectId: number,
    userId: number,
    role: string = 'member',
  ): Promise<ProjectMember> {
    await this.projectsService.getProjectById(projectId);
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const existing = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El usuario ya es miembro de este proyecto');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: { user: true },
    });
  }

  async removeMember(projectId: number, userId: number): Promise<void> {
    await this.projectsService.getProjectById(projectId);
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('El usuario no es miembro de este proyecto');
    }

    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async updateMemberRole(
    projectId: number,
    userId: number,
    role: string,
  ): Promise<ProjectMember> {
    await this.projectsService.getProjectById(projectId);
    return this.prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: { role },
      include: { user: true },
    });
  }
}
