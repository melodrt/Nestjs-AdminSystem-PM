import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const authApi = {
  register: async (email, password, name) => {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },
};

// Interceptor para agregar el token a las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

