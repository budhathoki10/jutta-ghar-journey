import api from './axios';

export const adminLogin = (credentials: { email: string; password: string }) =>
  api.post('/admin/login', credentials);

export const adminRegister = (credentials: { email: string; password: string }) =>
  api.post('/admin/register', credentials);

export const getMe = () => api.get('/admin/me');
