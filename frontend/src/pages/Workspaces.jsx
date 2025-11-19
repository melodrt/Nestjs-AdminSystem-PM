import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../store/slices/workspacesSlice';
import { useState } from 'react';
import { Plus, Edit2, Trash2, FolderKanban, Users } from 'lucide-react';
import WorkspaceMembers from '../components/WorkspaceMembers';

export default function Workspaces() {
  const dispatch = useAppDispatch();
  const { items: workspaces, loading, error } = useAppSelector(
    (state) => state.workspaces
  );
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkspaceForMembers, setSelectedWorkspaceForMembers] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingWorkspace) {
        await dispatch(
          updateWorkspace({
            id: editingWorkspace.id,
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      } else {
        await dispatch(
          createWorkspace({
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      }
      setFormData({ name: '', description: '' });
      setEditingWorkspace(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar workspace:', err);
    }
  };

  const handleEdit = (workspace) => {
    setEditingWorkspace(workspace);
    setFormData({ name: workspace.name, description: workspace.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este workspace?')) return;

    try {
      await dispatch(deleteWorkspace(id)).unwrap();
    } catch (err) {
      console.error('Error al eliminar workspace:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Workspaces
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingWorkspace(null);
              setFormData({ name: '', description: '' });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={20} />
            {showForm ? 'Cancelar' : 'Nuevo Workspace'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingWorkspace ? 'Editar Workspace' : 'Nuevo Workspace'}
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
                  placeholder="Nombre del workspace"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción (opcional)"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {editingWorkspace ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FolderKanban size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay workspaces. ¡Crea uno nuevo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FolderKanban
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {workspace.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWorkspaceForMembers(workspace.id)}
                      className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                      title="Gestionar miembros"
                    >
                      <Users size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(workspace)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(workspace.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {workspace.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {workspace.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Creado: {new Date(workspace.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedWorkspaceForMembers && (
        <WorkspaceMembers
          workspaceId={selectedWorkspaceForMembers}
          onClose={() => setSelectedWorkspaceForMembers(null)}
        />
      )}
    </div>
  );
}

