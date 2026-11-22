import api from './axios';

export const healthWorkerApi = {
  getDashboardStats: () => api.get('/api/health-workers/dashboard'),
  getAssignedMembers: () => api.get('/api/health-workers/users'),
  getPriorityList: () => api.get('/api/health-workers/priority-list'),
  getMemberDetails: (memberId) => api.get(`/api/health-workers/users/${memberId}`),
  getFollowups: () => api.get('/api/health-workers/followups'),
};
