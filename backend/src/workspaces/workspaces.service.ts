import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Workspace } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllWorkspaces(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkspaceById(id: number): Promise<Workspace> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace con ID ${id} no encontrado`);
    }
    return workspace;
  }

  async createWorkspace(name: string, description: string): Promise<Workspace> {
    return this.prisma.workspace.create({
      data: {
        name,
        description,
      },
    });
  }

  async updateWorkspace(
    id: number,
    name?: string,
    description?: string,
  ): Promise<Workspace> {
    await this.getWorkspaceById(id); // Validar que existe

    return this.prisma.workspace.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    });
  }

  async deleteWorkspace(id: number): Promise<void> {
    await this.getWorkspaceById(id); // Validar que existe
    await this.prisma.workspace.delete({
      where: { id },
    });
  }
}
