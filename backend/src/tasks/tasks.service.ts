import { Injectable, NotFoundException } from '@nestjs/common';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return task;
  }

  createTask(title: string, description: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: number, title?: string, description?: string, completed?: boolean): Task {
    const task = this.getTaskById(id);
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    return task;
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    this.tasks.splice(index, 1);
  }
}
