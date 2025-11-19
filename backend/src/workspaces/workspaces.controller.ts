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
import { Workspace } from '@prisma/client';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/create-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async getAllWorkspaces(): Promise<Workspace[]> {
    return this.workspacesService.getAllWorkspaces();
  }

  @Get(':id')
  async getWorkspaceById(@Param('id', ParseIntPipe) id: number): Promise<Workspace> {
    return this.workspacesService.getWorkspaceById(id);
  }

  @Post()
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspacesService.createWorkspace(
      createWorkspaceDto.name,
      createWorkspaceDto.description,
    );
  }

  @Put(':id')
  async updateWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    return this.workspacesService.updateWorkspace(
      id,
      updateWorkspaceDto.name,
      updateWorkspaceDto.description,
    );
  }

  @Delete(':id')
  async deleteWorkspace(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.workspacesService.deleteWorkspace(id);
    return { message: 'Workspace eliminado exitosamente' };
  }
}
