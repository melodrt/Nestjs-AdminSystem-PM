import { Injectable, NotFoundException } from '@nestjs/common';

export interface Workspace {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class WorkspacesService {
  private workspaces: Workspace[] = [];
  private nextId = 1;

  getAllWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  getWorkspaceById(id: number): Workspace {
    const workspace = this.workspaces.find((w) => w.id === id);
    if (!workspace) {
      throw new NotFoundException(`Workspace con ID ${id} no encontrado`);
    }
    return workspace;
  }

  createWorkspace(name: string, description: string): Workspace {
    const newWorkspace: Workspace = {
      id: this.nextId++,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workspaces.push(newWorkspace);
    return newWorkspace;
  }

  updateWorkspace(id: number, name?: string, description?: string): Workspace {
    const workspace = this.getWorkspaceById(id);
    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    workspace.updatedAt = new Date();
    return workspace;
  }

  deleteWorkspace(id: number): void {
    const index = this.workspaces.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new NotFoundException(`Workspace con ID ${id} no encontrado`);
    }
    this.workspaces.splice(index, 1);
  }
}
