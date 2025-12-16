import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe } from '../api/authApi';

export const initialAuthState = {
  user: null,
  accessToken: null,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialAuthState,

      // unified setter: pass { user, accessToken } or partial
      setAuth: ({ user, accessToken }) =>
        set(state => ({
          user: user ?? state.user,
          accessToken: accessToken ?? state.accessToken,
        })),

      setUser: user => set({ user }),
      setToken: accessToken => set({ accessToken }),
    }),
    {
      name: 'auth-store',
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
