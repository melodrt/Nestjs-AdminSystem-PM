import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

export const tasksApi = {
  getAllTasks: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createTask: async (title, description) => {
    const response = await axios.post(API_URL, { title, description });
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

