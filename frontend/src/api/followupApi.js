import api from './axios';

export const followupApi = {
  createFollowUp: (followUpData) => api.post('/api/followups', followUpData),
  updateFollowUp: (id, followUpData) => api.put(`/api/followups/${id}`, followUpData),
  getUserFollowUps: (userId) => api.get(`/api/followups/${userId}`),
};
