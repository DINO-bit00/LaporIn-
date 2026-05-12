import axios from 'axios';

/**
 * Axios instance terpusat untuk LaporIn.
 * - Development: proxy Vite (/api → localhost:3000)
 * - Production: VITE_API_URL env var (e.g. https://laporin-backend.up.railway.app/api)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, // 60s — model AI bisa lambat saat cold-start
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ LAPORAN ============

/**
 * Kirim laporan baru ke backend.
 * Backend akan forward ke HuggingFace AI untuk klasifikasi.
 * @param {{ teks: string, lokasi?: string, nama?: string }} data
 * @returns {Promise<object>} response data
 */
export const submitLaporan = async (data) => {
  const response = await api.post('/laporan', data);
  return response.data;
};

/**
 * Ambil semua laporan, urut dari terbaru.
 * @param {{ kategori?: string, sentimen?: string }} filters
 * @returns {Promise<object>} response data
 */
export const getLaporan = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.kategori && filters.kategori !== 'all') {
    params.append('kategori', filters.kategori);
  }
  if (filters.sentimen && filters.sentimen !== 'all') {
    params.append('sentimen', filters.sentimen);
  }
  const response = await api.get(`/laporan?${params.toString()}`);
  return response.data;
};

/**
 * Ambil statistik agregat untuk dashboard.
 * @returns {Promise<object>} response data
 */
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// ============ HEALTH CHECK ============

/**
 * Cek apakah backend & AI service sedang aktif.
 * @returns {Promise<object>}
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
