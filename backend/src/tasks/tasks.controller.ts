import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: { title: string; description: string },
  ): Task {
    return this.tasksService.createTask(
      createTaskDto.title,
      createTaskDto.description,
    );
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: { title?: string; description?: string; completed?: boolean },
  ): Task {
    return this.tasksService.updateTask(
      id,
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.completed,
    );
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.tasksService.deleteTask(id);
    return { message: 'Tarea eliminada exitosamente' };
  }
}
