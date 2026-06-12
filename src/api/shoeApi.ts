import api from './axios';
import type { ShoeInput } from '@/types/shoe';

type ShoeQueryParams = Record<string, string | number | boolean | undefined>;

const normalizeShoeResponse = (response: any) => {
  const payload = response.data;

  if (Array.isArray(payload)) {
    response.data = {
      data: payload,
      shoes: payload,
      total: payload.length,
    };
    return response;
  }

  if (Array.isArray(payload?.shoes)) {
    response.data = {
      ...payload,
      data: payload.shoes,
    };
    return response;
  }

  if (Array.isArray(payload?.data)) {
    response.data = {
      ...payload,
      shoes: payload.shoes || payload.data,
      total: payload.total ?? payload.data.length,
    };
  }

  return response;
};

export const fetchShoes = (params: ShoeQueryParams = {}) =>
  api.get('/shoes', {
    params: {
      ...params,
      _t: Date.now(),
    },
  }).then(normalizeShoeResponse);
export const fetchShoe = (id: string) => api.get(`/shoes/${id}`);
export const createShoe = (data: ShoeInput) => api.post('/shoes', data);
export const updateShoe = (id: string, data: ShoeInput) => api.put(`/shoes/${id}`, data);
export const deleteShoe = (id: string) => api.delete(`/shoes/${id}`);
