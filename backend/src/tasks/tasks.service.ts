import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    // Validar que el proyecto existe
    await this.projectsService.getProjectById(projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return task;
  }

  async createTask(
    projectId: number,
    title: string,
    description: string,
    assignedTo?: number,
  ): Promise<Task> {
    // Validar que el proyecto existe
    await this.projectsService.getProjectById(projectId);

    return this.prisma.task.create({
      data: {
        projectId,
        title,
        description,
        status: 'todo',
        ...(assignedTo !== undefined && { assignedTo }),
      },
    });
  }

  async updateTask(
    id: number,
    title?: string,
    description?: string,
    status?: 'todo' | 'in-progress' | 'done',
    assignedTo?: number,
  ): Promise<Task> {
    await this.getTaskById(id); // Validar que existe

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(assignedTo !== undefined && { assignedTo }),
      },
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.getTaskById(id); // Validar que existe
    await this.prisma.task.delete({
      where: { id },
    });
  }
}
