import { useState, useEffect } from 'react';
import { membersApi } from '../api/membersApi';
import { usersApi } from '../api/usersApi';
import { UserPlus, UserMinus, Shield, Crown, User, X } from 'lucide-react';

export default function WorkspaceMembers({ workspaceId, onClose }) {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');

  useEffect(() => {
    if (workspaceId) {
      loadMembers();
      loadUsers();
    }
  }, [workspaceId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await membersApi.getWorkspaceMembers(workspaceId);
      setMembers(data);
    } catch (err) {
      console.error('Error al cargar miembros:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await membersApi.addWorkspaceMember(workspaceId, parseInt(selectedUserId), selectedRole);
      await loadMembers();
      setShowAddMember(false);
      setSelectedUserId('');
      setSelectedRole('member');
    } catch (err) {
      console.error('Error al agregar miembro:', err);
      alert('Error al agregar miembro: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) return;
    try {
      await membersApi.removeWorkspaceMember(workspaceId, userId);
      await loadMembers();
    } catch (err) {
      console.error('Error al eliminar miembro:', err);
      alert('Error al eliminar miembro: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await membersApi.updateWorkspaceMemberRole(workspaceId, userId, newRole);
      await loadMembers();
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      alert('Error al actualizar rol: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown size={16} className="text-yellow-600" />;
      case 'admin':
        return <Shield size={16} className="text-blue-600" />;
      default:
        return <User size={16} className="text-gray-600" />;
    }
  };

  const availableUsers = users.filter(
    (user) => !members.some((member) => member.userId === user.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Miembros del Workspace
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8">Cargando miembros...</div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Miembros ({members.length})
                </h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <UserPlus size={18} />
                  Agregar Miembro
                </button>
              </div>

              {showAddMember && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Agregar Nuevo Miembro
                  </h4>
                  <div className="space-y-3">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Seleccionar usuario</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="member">Miembro</option>
                      <option value="admin">Administrador</option>
                      <option value="owner">Propietario</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddMember}
                        disabled={!selectedUserId}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Agregar
                      </button>
                      <button
                        onClick={() => {
                          setShowAddMember(false);
                          setSelectedUserId('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay miembros en este workspace
                  </div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getRoleIcon(member.role)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="member">Miembro</option>
                          <option value="admin">Administrador</option>
                          <option value="owner">Propietario</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Eliminar miembro"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

