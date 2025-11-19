import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const usersApi = {
  getAllUsers: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
};

