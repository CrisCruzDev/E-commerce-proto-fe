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
  return apiHandler(() => api.post('/auth/request-admin-key', { email }));
};

export const verifyAdminKey = async ({ email, adminKey }) => {
  return apiHandler(() =>
    api.post('/auth/verify-admin-key', { email, adminKey })
  );
};
export const getMe = async () => {
  return apiHandler(() => api.get('/auth/me'));
};
