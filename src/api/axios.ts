import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const getCookie = (name: string): string => {
    if (typeof document === 'undefined') return '';
    try {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(nameEQ)) {
          return trimmed.substring(nameEQ.length);
        }
      }
      return '';
    } catch {
      return '';
    }
  };

  let token = '';
  try {
    token =
      getCookie('admin_token') ||
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token') ||
      '';
  } catch (e) {
    token = '';
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  } else if (config.data) {
    config.headers.set('Content-Type', 'application/json');
  }

  return config;
});

export default api;
