import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && !(config.data instanceof FormData) && config.headers) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default api;
