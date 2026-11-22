import api from './axios';

export const adminApi = {
  getStatistics: () => api.get('/api/admin/statistics'),
  getTrends: () => api.get('/api/admin/trends'),
  getUsers: () => api.get('/api/admin/users'),
  getHealthWorkers: () => api.get('/api/admin/health-workers'),
  getAssessments: () => api.get('/api/admin/assessments'),
  getFollowUps: () => api.get('/api/admin/followups'),
  assignHealthWorker: (userId, nurseId) => api.put(`/api/admin/users/${userId}/assign-nurse`, { nurseId }),
};
