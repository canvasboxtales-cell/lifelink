import api from './axios';

export const searchDonorsApi = (params: Record<string, unknown>) =>
  api.get('/api/donors/search', { params }).then(r => r.data);

export const getDonorProfileApi = (donorId: string) =>
  api.get(`/api/donors/${donorId}/profile`).then(r => r.data);

export const updateDonorProfileApi = (donorId: string, data: object) =>
  api.put(`/api/donors/${donorId}/profile`, data).then(r => r.data);

export const updateAvailabilityApi = (donorId: string, available: boolean) =>
  api.put(`/api/donors/${donorId}/availability`, { available }).then(r => r.data);
