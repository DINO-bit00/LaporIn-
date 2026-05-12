import api from './api';

const TOKEN_KEY = 'laporin_admin_token';

export const login = async (password) => {
  const res = await api.post('/auth/login', { password });
  const { token } = res.data;
  localStorage.setItem(TOKEN_KEY, token);
  return token;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const verifyToken = async () => {
  const token = getToken();
  if (!token) return false;
  try {
    await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch {
    logout();
    return false;
  }
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
