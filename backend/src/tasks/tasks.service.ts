import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  constructor(private readonly projectsService: ProjectsService) {}

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksByProject(projectId: number): Task[] {
    // Validar que el proyecto existe
    this.projectsService.getProjectById(projectId);
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  getTaskById(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return task;
  }

  createTask(projectId: number, title: string, description: string): Task {
    // Validar que el proyecto existe
    this.projectsService.getProjectById(projectId);

    const newTask: Task = {
      id: this.nextId++,
      projectId,
      title,
      description,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(
    id: number,
    title?: string,
    description?: string,
    status?: 'todo' | 'in-progress' | 'done',
  ): Task {
    const task = this.getTaskById(id);
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    task.updatedAt = new Date();
    return task;
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    this.tasks.splice(index, 1);
  }

  deleteTasksByProject(projectId: number): void {
    this.tasks = this.tasks.filter((t) => t.projectId !== projectId);
  }
}
