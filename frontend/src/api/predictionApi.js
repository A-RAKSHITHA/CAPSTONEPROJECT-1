import api from './axios';

export const predictionApi = {
  getUserPredictions: (userId) => api.get(`/api/predictions/${userId}`),
  getLatestAssessment: (userId) => api.get(`/api/predictions/${userId}/latest`),
  getModelMetrics: () => api.get('/api/predictions/metrics'),
};
