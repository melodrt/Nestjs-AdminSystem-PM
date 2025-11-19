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
import { ProjectsService } from './projects.service';
import { Project } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(@Query('workspaceId') workspaceId?: string): Promise<Project[]> {
    if (workspaceId) {
      return this.projectsService.getProjectsByWorkspace(parseInt(workspaceId));
    }
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(
      createProjectDto.workspaceId,
      createProjectDto.name,
      createProjectDto.description,
    );
  }

  @Put(':id')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.updateProject(
      id,
      updateProjectDto.name,
      updateProjectDto.description,
      updateProjectDto.status,
    );
  }

  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.projectsService.deleteProject(id);
    return { message: 'Proyecto eliminado exitosamente' };
  }
}
