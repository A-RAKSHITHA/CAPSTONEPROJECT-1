import api from './axios';

export const healthApi = {
  submitHealthRecord: (recordData) => api.post('/api/health-records', recordData),
  getUserRecords: (userId) => api.get(`/api/health-records/${userId}`),
  getRecordById: (userId, recordId) => api.get(`/api/health-records/${userId}/${recordId}`),
};
