import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const userApi = {
  updateProfile: async (name, email) => {
    const response = await axios.put(`${API_URL}/profile`, { name, email });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deleteProfile: async () => {
    const response = await axios.delete(`${API_URL}/profile`);
    return response.data;
  },
};

