import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axiosInstance'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setCredentials: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),

      setToken: (accessToken) => set({ accessToken }),

      updateUser: (user) => set({ user }),

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
        localStorage.removeItem('auth-store')
      },

      rehydrateUser: () => {
        const state = get()
        if (state.user && state.accessToken) {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${state.accessToken}`
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
