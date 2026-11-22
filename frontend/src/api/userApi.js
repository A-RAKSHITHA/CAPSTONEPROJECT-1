import api from './axios';

export const userApi = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  updateProfile: (id, data) => api.put(`/api/users/${id}`, data),
  updatePhoto: (id, profilePhoto) => api.put(`/api/users/${id}/photo`, { profilePhoto }),
  getDashboard: (id) => api.get(`/api/users/${id}/dashboard`),
  getHealthJourney: (id) => api.get(`/api/users/${id}/history`),
};
