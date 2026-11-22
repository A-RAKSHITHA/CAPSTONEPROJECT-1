import api from './axios';

export const notificationApi = {
  getUserAlerts: (userId) => api.get(`/api/notifications/${userId}`),
  getNurseAlerts: (nurseId) => api.get(`/api/notifications/nurse/${nurseId}`),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
};
