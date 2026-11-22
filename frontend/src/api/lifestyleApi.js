import api from './axios';

export const lifestyleApi = {
  saveRecord: (recordData) => api.post('/api/lifestyle', recordData),
  getLatestRecord: (userId) => api.get(`/api/lifestyle/${userId}`),
  getHistory: (userId) => api.get(`/api/lifestyle/${userId}/history`),
};
