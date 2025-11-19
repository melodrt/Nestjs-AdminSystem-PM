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
import { Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Query('projectId') projectId?: string): Promise<Task[]> {
    if (projectId) {
      return this.tasksService.getTasksByProject(parseInt(projectId));
    }
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(
      createTaskDto.projectId,
      createTaskDto.title,
      createTaskDto.description || '',
      createTaskDto.assignedTo,
    );
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(
      id,
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.status,
      updateTaskDto.assignedTo,
    );
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tasksService.deleteTask(id);
    return { message: 'Tarea eliminada exitosamente' };
  }
}
