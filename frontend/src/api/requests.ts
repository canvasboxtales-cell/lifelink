import api from './axios';

export const listRequestsApi = () =>
  api.get('/api/requests/').then(r => r.data);

export const createRequestApi = (data: object) =>
  api.post('/api/requests/', data).then(r => r.data);

export const updateRequestStatusApi = (id: string, status: string) =>
  api.put(`/api/requests/${id}/status`, { status }).then(r => r.data);
