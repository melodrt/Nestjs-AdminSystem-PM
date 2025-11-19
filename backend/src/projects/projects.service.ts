import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkspacesService } from '../workspaces/workspaces.service';

export interface Project {
  id: number;
  workspaceId: number;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];
  private nextId = 1;

  constructor(private readonly workspacesService: WorkspacesService) {}

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectsByWorkspace(workspaceId: number): Project[] {
    // Validar que el workspace existe
    this.workspacesService.getWorkspaceById(workspaceId);
    return this.projects.filter((p) => p.workspaceId === workspaceId);
  }

  getProjectById(id: number): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return project;
  }

  createProject(workspaceId: number, name: string, description: string): Project {
    // Validar que el workspace existe
    this.workspacesService.getWorkspaceById(workspaceId);

    const newProject: Project = {
      id: this.nextId++,
      workspaceId,
      name,
      description,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(
    id: number,
    name?: string,
    description?: string,
    status?: 'active' | 'archived' | 'completed',
  ): Project {
    const project = this.getProjectById(id);
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    project.updatedAt = new Date();
    return project;
  }

  deleteProject(id: number): void {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    this.projects.splice(index, 1);
  }

  deleteProjectsByWorkspace(workspaceId: number): void {
    this.projects = this.projects.filter((p) => p.workspaceId !== workspaceId);
  }
}
