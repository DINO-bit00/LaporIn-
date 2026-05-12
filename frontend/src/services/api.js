import axios from 'axios';

/**
 * Axios instance terpusat untuk LaporIn.
 * - Development: proxy Vite (/api → localhost:3000)
 * - Production: VITE_API_URL env var
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ LAPORAN ============

export const submitLaporan = async (data) => {
  const response = await api.post('/laporan', data);
  return response.data;
};

export const getLaporan = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.kategori && filters.kategori !== 'all') params.append('kategori', filters.kategori);
  if (filters.sentimen && filters.sentimen !== 'all') params.append('sentimen', filters.sentimen);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.order) params.append('order', filters.order);
  const response = await api.get(`/laporan?${params.toString()}`);
  return response.data;
};

export const updateLaporan = async (id, data, token) => {
  const response = await api.patch(`/laporan/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteLaporan = async (id, token) => {
  const response = await api.delete(`/laporan/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ============ STATS ============

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getTrend = async () => {
  const response = await api.get('/stats/trend');
  return response.data;
};

export const getKeywords = async () => {
  const response = await api.get('/stats/keywords');
  return response.data;
};

// ============ HEALTH ============

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
