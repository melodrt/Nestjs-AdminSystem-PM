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
import { WorkspacesService } from './workspaces.service';
import type { Workspace } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  getAllWorkspaces(): Workspace[] {
    return this.workspacesService.getAllWorkspaces();
  }

  @Get(':id')
  getWorkspaceById(@Param('id', ParseIntPipe) id: number): Workspace {
    return this.workspacesService.getWorkspaceById(id);
  }

  @Post()
  createWorkspace(
    @Body() createWorkspaceDto: { name: string; description: string },
  ): Workspace {
    return this.workspacesService.createWorkspace(
      createWorkspaceDto.name,
      createWorkspaceDto.description,
    );
  }

  @Put(':id')
  updateWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: { name?: string; description?: string },
  ): Workspace {
    return this.workspacesService.updateWorkspace(
      id,
      updateWorkspaceDto.name,
      updateWorkspaceDto.description,
    );
  }

  @Delete(':id')
  deleteWorkspace(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.workspacesService.deleteWorkspace(id);
    return { message: 'Workspace eliminado exitosamente' };
  }
}
