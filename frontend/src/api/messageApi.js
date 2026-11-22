import api from './axios';

export const messageApi = {
  sendMessage: (messageData) => api.post('/api/messages', messageData),
  getConversation: (userId) => api.get(`/api/messages/${userId}`),
  markAsRead: (messageId) => api.put(`/api/messages/${messageId}/read`),
  markConversationAsRead: (userId) => api.put(`/api/messages/user/${userId}/read-all`),
};
