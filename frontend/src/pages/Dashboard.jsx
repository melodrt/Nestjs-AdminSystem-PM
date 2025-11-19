import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../api/analyticsApi';
import { useAppSelector } from '../hooks/redux';
import {
  FolderKanban,
  FolderOpen,
  ListTodo,
  Users,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // TODOS los hooks deben estar antes de cualquier return condicional
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth?.user);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getDashboardStats();
      // Validar que los datos tengan la estructura esperada
      if (data && typeof data === 'object') {
        setStats(data);
      } else {
        setError('Error: Datos inválidos recibidos del servidor');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar estadísticas. Verifica que el backend esté corriendo.');
      console.error('Error al cargar estadísticas:', err);
      // Establecer valores por defecto para evitar que la app se rompa
      setStats({
        overview: { totalWorkspaces: 0, totalProjects: 0, totalTasks: 0, totalUsers: 0 },
        tasks: { byStatus: {}, recent: [], myTasks: [] },
        projects: { byStatus: {}, recent: [] },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { overview = {}, tasks = {}, projects = {} } = stats || {};

  // Calcular porcentaje de tareas completadas
  const totalTasksCount = overview?.totalTasks || 0;
  const completedTasks = tasks?.byStatus?.done || 0;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasks / totalTasksCount) * 100) 
    : 0;

  // Calcular porcentaje de proyectos activos
  const totalProjectsCount = overview?.totalProjects || 0;
  const activeProjects = projects?.byStatus?.active || 0;
  const activeProjectsPercentage = totalProjectsCount > 0
    ? Math.round((activeProjects / totalProjectsCount) * 100)
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-yellow-600" />;
      case 'todo':
        return <Circle size={16} className="text-gray-500" />;
      default:
        return <Circle size={16} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bienvenido, {user?.name || 'Usuario'}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Workspaces</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {overview?.totalWorkspaces || 0}
                </p>
              </div>
              <FolderKanban size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Proyectos</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {overview?.totalProjects || 0}
                </p>
              </div>
              <FolderOpen size={40} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tareas</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {overview?.totalTasks || 0}
                </p>
              </div>
              <ListTodo size={40} className="text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Usuarios</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {overview?.totalUsers || 0}
                </p>
              </div>
              <Users size={40} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progreso de Tareas
              </h2>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Tareas completadas</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {completedTasks} de {totalTasksCount} tareas completadas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Proyectos Activos
              </h2>
              <FolderOpen className="text-purple-600" size={24} />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Proyectos activos</span>
                <span className="font-semibold">{activeProjectsPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${activeProjectsPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {activeProjects} de {totalProjectsCount} proyectos activos
            </p>
          </div>
        </div>

        {/* Tasks by Status and Projects by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tareas por Estado
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Circle size={20} className="text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Por hacer</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasks?.byStatus?.todo || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <PlayCircle size={20} className="text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">En progreso</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {tasks?.byStatus?.['in-progress'] || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Completadas</span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {tasks?.byStatus?.done || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Proyectos por Estado
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Activos</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {projects?.byStatus?.active || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Archivados</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects?.byStatus?.archived || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Completados</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {projects?.byStatus?.completed || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks Section */}
        {tasks?.myTasks && tasks.myTasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mis Tareas
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver todas
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.myTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  onClick={() => navigate('/tasks')}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.projectName} • {task.workspaceName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === 'todo'
                      ? 'Por hacer'
                      : task.status === 'in-progress'
                      ? 'En progreso'
                      : 'Completada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Tasks and Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tareas Recientes
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver todas
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {tasks?.recent && tasks.recent.length > 0 ? (
                tasks.recent.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => navigate('/tasks')}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {task.projectName}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(task.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status === 'todo'
                        ? 'Por hacer'
                        : task.status === 'in-progress'
                        ? 'En progreso'
                        : 'Completada'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay tareas recientes
                </p>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Proyectos Recientes
              </h2>
              <button
                onClick={() => navigate('/projects')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver todos
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {projects?.recent && projects.recent.length > 0 ? (
                projects.recent.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => navigate('/projects')}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FolderOpen
                        size={20}
                        className={`${
                          project.status === 'active'
                            ? 'text-green-600'
                            : project.status === 'completed'
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {project.workspaceName}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {project.taskCount} tareas
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {project.memberCount} miembros
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {project.status === 'active'
                        ? 'Activo'
                        : project.status === 'completed'
                        ? 'Completado'
                        : 'Archivado'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay proyectos recientes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

