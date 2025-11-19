import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

export const tasksApi = {
  getAllTasks: async (projectId = null) => {
    const url = projectId ? `${API_URL}?projectId=${projectId}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createTask: async (projectId, title, description, assignedTo) => {
    const response = await axios.post(API_URL, { projectId, title, description, assignedTo });
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

