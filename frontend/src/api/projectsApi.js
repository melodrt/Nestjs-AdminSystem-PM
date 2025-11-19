import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

export const projectsApi = {
  getAllProjects: async (workspaceId = null) => {
    const url = workspaceId ? `${API_URL}?workspaceId=${workspaceId}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createProject: async (workspaceId, name, description) => {
    const response = await axios.post(API_URL, { workspaceId, name, description });
    return response.data;
  },

  updateProject: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

