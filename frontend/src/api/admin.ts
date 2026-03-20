import api from './axios';

export const getDashboardApi = () =>
  api.get('/api/admin/dashboard').then(r => r.data);

export const getModelMetricsApi = () =>
  api.get('/api/admin/model-metrics').then(r => r.data);

export const getAdminDonorsApi = (params: Record<string, unknown>) =>
  api.get('/api/admin/donors', { params }).then(r => r.data);
