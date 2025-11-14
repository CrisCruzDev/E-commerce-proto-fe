import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 🧩 Attach token before each request
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ✅ Response Interceptor – Refresh if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { refreshToken, setToken, logout } = useAuthStore.getState()

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await api.post(
          '/auth/refresh-token',
          { token: refreshToken },
          { withCredentials: true },
        )

        const newAccessToken = res.data?.accessToken
        setToken(newAccessToken)

        // retry the failed request

        // Update axios default headers
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`

        // Attach new token to the retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshErr) {
        console.warn('Refresh token invalid, logging out.')
        logout()

        // Auto redirect to login
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(error)
  },
)

export default api
