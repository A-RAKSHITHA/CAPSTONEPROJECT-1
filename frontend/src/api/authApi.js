import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  sendOtp: (data) => api.post('/api/auth/send-otp', data),
};
