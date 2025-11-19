import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(userId?: number) {
    const [workspaces, projects, tasks, users] = await Promise.all([
      this.prisma.workspace.count(),
      this.prisma.project.count(),
      this.prisma.task.count(),
      this.prisma.user.count(),
    ]);

    const tasksByStatus = await this.prisma.task.groupBy({
      by: ['status'],
      _count: true,
    });

    const projectsByStatus = await this.prisma.project.groupBy({
      by: ['status'],
      _count: true,
    });

    // Obtener tareas recientes (últimas 10)
    const recentTasks = await this.prisma.task.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Obtener proyectos recientes (últimos 10)
    const recentProjects = await this.prisma.project.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });

    // Obtener tareas asignadas al usuario actual
    let myTasks: Array<{
      id: number;
      projectId: number;
      title: string;
      description: string;
      status: string;
      assignedTo: number | null;
      createdAt: Date;
      updatedAt: Date;
      project: {
        id: number;
        name: string;
        workspace: {
          id: number;
          name: string;
        };
      };
    }> = [];
    
    if (userId) {
      myTasks = await this.prisma.task.findMany({
        where: { assignedTo: userId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    }

    return {
      overview: {
        totalWorkspaces: workspaces,
        totalProjects: projects,
        totalTasks: tasks,
        totalUsers: users,
      },
      tasks: {
        byStatus: tasksByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        recent: recentTasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          projectId: task.projectId,
          projectName: task.project.name,
          workspaceName: task.project.workspace.name,
          createdAt: task.createdAt,
          assignedTo: task.assignedTo,
        })),
        myTasks: myTasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          projectId: task.projectId,
          projectName: task.project.name,
          workspaceName: task.project.workspace.name,
          createdAt: task.createdAt,
        })),
      },
      projects: {
        byStatus: projectsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        recent: recentProjects.map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          workspaceId: project.workspaceId,
          workspaceName: project.workspace.name,
          taskCount: project._count.tasks,
          memberCount: project._count.members,
          createdAt: project.createdAt,
        })),
      },
    };
  }

  async getWorkspaceStats(workspaceId: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        projects: {
          include: {
            tasks: true,
          },
        },
        members: true,
      },
    });

    if (!workspace) {
      return null;
    }

    const totalProjects = workspace.projects.length;
    const totalTasks = workspace.projects.reduce(
      (sum, project) => sum + project.tasks.length,
      0,
    );
    const tasksByStatus = workspace.projects.reduce(
      (acc, project) => {
        project.tasks.forEach((task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
      },
      stats: {
        totalProjects,
        totalTasks,
        totalMembers: workspace.members.length,
        tasksByStatus,
      },
      projects: workspace.projects.map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        taskCount: project.tasks.length,
      })),
    };
  }

  async getProjectStats(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        members: true,
      },
    });

    if (!project) {
      return null;
    }

    const tasksByStatus = project.tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
      },
      stats: {
        totalTasks: project.tasks.length,
        totalMembers: project.members.length,
        tasksByStatus,
      },
    };
  }
}
