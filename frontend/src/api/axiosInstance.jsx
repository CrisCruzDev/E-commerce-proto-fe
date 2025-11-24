import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API BASE URL:', import.meta.env.VITE_API_URL);
console.log('ENV:', import.meta.env);

// 🧩 Attach token before each request
api.interceptors.request.use(
  config => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Response Interceptor – Refresh if expired
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log('AXIOS ERROR:', error);
    console.log('Original request:', originalRequest);

    if (!error.response) {
      return Promise.reject(error);
    }

    // 🚫 Prevent infinite loop on the refresh-token request
    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    const { setToken, logout } = useAuthStore.getState();

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/auth/refresh-token');

        const newAccessToken = res.data?.accessToken;
        setToken(newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        console.warn('Refresh token invalid, logging out.');
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
