import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query('projectId') projectId?: string): Task[] {
    if (projectId) {
      return this.tasksService.getTasksByProject(parseInt(projectId));
    }
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: { projectId: number; title: string; description: string },
  ): Task {
    return this.tasksService.createTask(
      createTaskDto.projectId,
      createTaskDto.title,
      createTaskDto.description,
    );
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: {
      title?: string;
      description?: string;
      status?: 'todo' | 'in-progress' | 'done';
    },
  ): Task {
    return this.tasksService.updateTask(
      id,
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.status,
    );
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.tasksService.deleteTask(id);
    return { message: 'Tarea eliminada exitosamente' };
  }
}
