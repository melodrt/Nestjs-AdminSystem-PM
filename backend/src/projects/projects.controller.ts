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
import type { Project } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllProjects(@Query('workspaceId') workspaceId?: string): Project[] {
    if (workspaceId) {
      return this.projectsService.getProjectsByWorkspace(parseInt(workspaceId));
    }
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  getProjectById(@Param('id', ParseIntPipe) id: number): Project {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  createProject(
    @Body() createProjectDto: { workspaceId: number; name: string; description: string },
  ): Project {
    return this.projectsService.createProject(
      createProjectDto.workspaceId,
      createProjectDto.name,
      createProjectDto.description,
    );
  }

  @Put(':id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: {
      name?: string;
      description?: string;
      status?: 'active' | 'archived' | 'completed';
    },
  ): Project {
    return this.projectsService.updateProject(
      id,
      updateProjectDto.name,
      updateProjectDto.description,
      updateProjectDto.status,
    );
  }

  @Delete(':id')
  deleteProject(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.projectsService.deleteProject(id);
    return { message: 'Proyecto eliminado exitosamente' };
  }
}
