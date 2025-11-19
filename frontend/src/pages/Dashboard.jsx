import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { FolderKanban, FolderOpen, ListTodo, Users, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error('Error al cargar estadísticas:', err);
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

  const { overview, tasks, projects } = stats;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Workspaces</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {overview.totalWorkspaces}
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
                  {overview.totalProjects}
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
                  {overview.totalTasks}
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
                  {overview.totalUsers}
                </p>
              </div>
              <Users size={40} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tasks by Status */}
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
                  {tasks.byStatus.todo || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <PlayCircle size={20} className="text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">En progreso</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {tasks.byStatus['in-progress'] || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Completadas</span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {tasks.byStatus.done || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Projects by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Proyectos por Estado
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Activos</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {projects.byStatus.active || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Archivados</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.byStatus.archived || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Completados</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {projects.byStatus.completed || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

