import api from './axiosInstance';
import { apiHandler } from './apiHandler';

export const registerUser = async userData => {
  return apiHandler(() => api.post('/auth/register', userData));
};

export const loginUser = async credentials => {
  return apiHandler(() => api.post('/auth/login', credentials));
};

export const logoutUser = async () => {
  return apiHandler(() => api.post('/auth/logout'));
};

export const requestAdminKey = async email => {
  return apiHandler(() => api.post('/admin/request-admin-key', { email }));
};

export const verifyAdminKey = async ({ email, adminKey }) => {
  return apiHandler(() =>
    api.post('/admin/verify-admin-key', { email, adminKey })
  );
};
export const getMe = async () => api.get('/auth/me');
