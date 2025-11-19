import axios from 'axios';

const API_URL = 'http://localhost:3000/workspaces';

export const workspacesApi = {
  getAllWorkspaces: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getWorkspaceById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createWorkspace: async (name, description) => {
    const response = await axios.post(API_URL, { name, description });
    return response.data;
  },

  updateWorkspace: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteWorkspace: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

