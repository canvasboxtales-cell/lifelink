import api from './axios';

export const loginApi = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password }).then(r => r.data);

export const registerDonorApi = (data: object) =>
  api.post('/api/auth/register/donor', data).then(r => r.data);

export const registerHospitalApi = (data: object) =>
  api.post('/api/auth/register/hospital', data).then(r => r.data);
