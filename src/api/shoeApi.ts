import api from './axios';
import type { ShoeInput } from '@/types/shoe';

type ShoeQueryParams = Record<string, string | number | boolean | undefined>;

export const fetchShoes = (params: ShoeQueryParams = {}) =>
  api.get('/shoes', {
    params: {
      ...params,
      _t: Date.now(),
    },
  });
export const fetchShoe = (id: string) => api.get(`/shoes/${id}`);
export const createShoe = (data: ShoeInput) => api.post('/shoes', data);
export const updateShoe = (id: string, data: ShoeInput) => api.put(`/shoes/${id}`, data);
export const deleteShoe = (id: string) => api.delete(`/shoes/${id}`);
