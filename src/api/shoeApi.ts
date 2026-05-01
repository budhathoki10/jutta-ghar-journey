import api from './axios';

export const fetchShoes = (params = {}) => api.get('/shoes', { params });
export const fetchShoe = (id: string) => api.get(`/shoes/${id}`);
export const createShoe = (data: any) => api.post('/shoes', data);
export const updateShoe = (id: string, data: any) => api.put(`/shoes/${id}`, data);
export const deleteShoe = (id: string) => api.delete(`/shoes/${id}`);
