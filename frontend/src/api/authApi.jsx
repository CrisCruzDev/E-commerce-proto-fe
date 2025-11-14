import api from './axiosInstance'
import { apiHandler } from './apiHandler'

export const registerUser = async (userData) => {
  apiHandler(() => api.post('/auth/register', userData))
}

export const loginUser = async (credentials) => {
  apiHandler(() => api.post('/auth/login', credentials))
}

export const refreshAccessToken = async (token) => {
  apiHandler(() => api.post('/auth/refresh-token', token))
}

export const logoutUser = async (token) => {
  apiHandler(() => api.post('/auth/logout', token))
}

export const requestAdminKey = async (email) => {
  apiHandler(() => api.post('/admin/request-admin-key', { email }))
}

export const verifyAdminKey = async ({ email, adminKey }) => {
  apiHandler(() => api.post('/admin/verify-admin-key', { email, adminKey }))
}
