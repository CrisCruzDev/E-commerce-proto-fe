import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
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

    // Guard clause: if no response, just reject
    if (!error.response) return Promise.reject(error);

    // Guard clause: Prevent infinite loops
    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // 1. Check for 401 (Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 2. Attempt to refresh
        const res = await api.post('/auth/refresh-token');
        const newAccessToken = res.data?.accessToken;

        // 3. Update Store and Headers
        useAuthStore.getState().setToken(newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. Retry original request
        return api(originalRequest);
      } catch (refreshErr) {
        // 🚨 CRITICAL FIX STARTS HERE 🚨
        console.warn('Refresh token expired. Cleaning up session...');

        // A. Wipe the Zustand store (and LocalStorage via persist)
        useAuthStore.getState().reset();

        // B. Redirect to login
        window.location.href = '/login';

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
