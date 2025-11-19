import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  async getAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectsByWorkspace(workspaceId: number): Promise<Project[]> {
    // Validar que el workspace existe
    await this.workspacesService.getWorkspaceById(workspaceId);
    return this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(id: number): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return project;
  }

  async createProject(workspaceId: number, name: string, description: string): Promise<Project> {
    // Validar que el workspace existe
    await this.workspacesService.getWorkspaceById(workspaceId);

    return this.prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
        status: 'active',
      },
    });
  }

  async updateProject(
    id: number,
    name?: string,
    description?: string,
    status?: 'active' | 'archived' | 'completed',
  ): Promise<Project> {
    await this.getProjectById(id); // Validar que existe

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });
  }

  async deleteProject(id: number): Promise<void> {
    await this.getProjectById(id); // Validar que existe
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
