import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const membersApi = {
  // Workspace Members
  getWorkspaceMembers: async (workspaceId) => {
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}/members`);
    return response.data;
  },

  addWorkspaceMember: async (workspaceId, userId, role = 'member') => {
    const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  updateWorkspaceMemberRole: async (workspaceId, userId, role) => {
    const response = await axios.put(`${API_URL}/workspaces/${workspaceId}/members/${userId}`, {
      role,
    });
    return response.data;
  },

  removeWorkspaceMember: async (workspaceId, userId) => {
    const response = await axios.delete(`${API_URL}/workspaces/${workspaceId}/members/${userId}`);
    return response.data;
  },

  // Project Members
  getProjectMembers: async (projectId) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/members`);
    return response.data;
  },

  addProjectMember: async (projectId, userId, role = 'member') => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  updateProjectMemberRole: async (projectId, userId, role) => {
    const response = await axios.put(`${API_URL}/projects/${projectId}/members/${userId}`, {
      role,
    });
    return response.data;
  },

  removeProjectMember: async (projectId, userId) => {
    const response = await axios.delete(`${API_URL}/projects/${projectId}/members/${userId}`);
    return response.data;
  },
};

