import axios from 'axios';

const API_URL = 'http://localhost:3000/analytics';

export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  },

  getWorkspaceStats: async (workspaceId) => {
    const response = await axios.get(`${API_URL}/workspaces/${workspaceId}`);
    return response.data;
  },

  getProjectStats: async (projectId) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}`);
    return response.data;
  },
};

