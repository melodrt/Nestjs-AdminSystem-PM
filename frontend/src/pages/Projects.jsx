import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../store/slices/projectsSlice';
import { fetchWorkspaces } from '../store/slices/workspacesSlice';
import { Plus, Edit2, Trash2, FolderOpen, Archive, CheckCircle2, Users } from 'lucide-react';
import ProjectMembers from '../components/ProjectMembers';

export default function Projects() {
  const dispatch = useAppDispatch();
  const { items: projects, loading, error } = useAppSelector((state) => state.projects);
  const { items: workspaces } = useAppSelector((state) => state.workspaces);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectForMembers, setSelectedProjectForMembers] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (selectedWorkspace) {
      dispatch(fetchProjects(selectedWorkspace));
    } else {
      dispatch(fetchProjects());
    }
  }, [dispatch, selectedWorkspace]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !selectedWorkspace) return;

    try {
      if (editingProject) {
        await dispatch(
          updateProject({
            id: editingProject.id,
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      } else {
        await dispatch(
          createProject({
            workspaceId: selectedWorkspace,
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      }
      setFormData({ name: '', description: '' });
      setEditingProject(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description });
    setSelectedWorkspace(project.workspaceId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      await dispatch(deleteProject(id)).unwrap();
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
    }
  };

  const handleStatusChange = async (project, newStatus) => {
    try {
      await dispatch(
        updateProject({
          id: project.id,
          status: newStatus,
        })
      ).unwrap();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 size={16} />;
      case 'archived':
        return <Archive size={16} />;
      case 'completed':
        return <CheckCircle2 size={16} />;
      default:
        return <FolderOpen size={16} />;
    }
  };

  const filteredProjects = selectedWorkspace
    ? projects.filter((p) => p.workspaceId === selectedWorkspace)
    : projects;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proyectos</h1>
          <div className="flex gap-4 items-center">
            <select
              value={selectedWorkspace || ''}
              onChange={(e) => {
                setSelectedWorkspace(e.target.value ? parseInt(e.target.value) : null);
                setShowForm(false);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Todos los Workspaces</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!selectedWorkspace) {
                  alert('Por favor selecciona un workspace primero');
                  return;
                }
                setShowForm(!showForm);
                setEditingProject(null);
                setFormData({ name: '', description: '' });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={20} />
              {showForm ? 'Cancelar' : 'Nuevo Proyecto'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre del proyecto"
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
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {editingProject ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {selectedWorkspace
                ? 'No hay proyectos en este workspace. ¡Crea uno nuevo!'
                : 'No hay proyectos. Selecciona un workspace y crea uno nuevo.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const workspace = workspaces.find((ws) => ws.id === project.workspaceId);
              return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen
                        size={24}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        {workspace && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {workspace.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProjectForMembers(project.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                        title="Gestionar miembros"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project, e.target.value)}
                      className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                        project.status
                      )} border-0 cursor-pointer`}
                    >
                      <option value="active">Activo</option>
                      <option value="archived">Archivado</option>
                      <option value="completed">Completado</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedProjectForMembers && (
        <ProjectMembers
          projectId={selectedProjectForMembers}
          onClose={() => setSelectedProjectForMembers(null)}
        />
      )}
    </div>
  );
}

