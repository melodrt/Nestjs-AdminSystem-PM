import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { tasksApi } from '../api/tasksApi';
import { fetchProjects } from '../store/slices/projectsSlice';
import { Check, X, Edit2, Trash2, Circle, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { items: projects } = useAppSelector((state) => state.projects);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [selectedProject]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.getAllTasks(selectedProject);
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas. Asegúrate de que el backend esté corriendo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !selectedProject) {
      alert('Por favor selecciona un proyecto y completa el título');
      return;
    }

    try {
      setError(null);
      if (editingTask) {
        await tasksApi.updateTask(editingTask.id, formData);
      } else {
        await tasksApi.createTask(selectedProject, formData.title, formData.description);
      }
      setFormData({ title: '', description: '' });
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      setError('Error al guardar la tarea');
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
    setSelectedProject(task.projectId);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    try {
      setError(null);
      await tasksApi.deleteTask(id);
      loadTasks();
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error(err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      setError(null);
      await tasksApi.updateTask(task.id, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo':
        return <Circle size={16} />;
      case 'in-progress':
        return <PlayCircle size={16} />;
      case 'done':
        return <CheckCircle2 size={16} />;
      default:
        return <Circle size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'Por hacer';
      case 'in-progress':
        return 'En progreso';
      case 'done':
        return 'Completada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Tareas
          </h1>
          <select
            value={selectedProject || ''}
            onChange={(e) => {
              setSelectedProject(e.target.value ? parseInt(e.target.value) : null);
              setEditingTask(null);
              setFormData({ title: '', description: '' });
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Todos los Proyectos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proyecto
                  </label>
                  <select
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un proyecto</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título de la tarea"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción (opcional)"
                    rows="3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingTask ? 'Actualizar' : 'Crear'}
                  </button>
                  {editingTask && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTask(null);
                        setFormData({ title: '', description: '' });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Tareas */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tareas ({tasks.length})
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedProject
                      ? 'No hay tareas en este proyecto. ¡Crea una nueva!'
                      : 'No hay tareas. Selecciona un proyecto y crea una nueva.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <div
                        key={task.id}
                        className={`p-4 border rounded-lg transition-all ${
                          task.status === 'done'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : task.status === 'in-progress'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className={`font-semibold ${
                                  task.status === 'done'
                                    ? 'line-through text-gray-500 dark:text-gray-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {task.title}
                              </h3>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task, e.target.value)}
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                  task.status
                                )} border-0 cursor-pointer`}
                              >
                                <option value="todo">Por hacer</option>
                                <option value="in-progress">En progreso</option>
                                <option value="done">Completada</option>
                              </select>
                            </div>
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              {project && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Proyecto: {project.name}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
