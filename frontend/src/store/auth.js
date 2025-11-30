import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      // unified setter: pass { user, accessToken } or partial
      setAuth: ({ user, accessToken }) =>
        set(state => ({
          user: user ?? state.user,
          accessToken: accessToken ?? state.accessToken,
        })),

      setUser: user => set({ user }),
      setToken: accessToken => set({ accessToken }),

      logout: async () => {
        const hasToken = get().accessToken;

        if (hasToken) {
          try {
            await logoutUser(); // invalidate refresh token in backend
          } catch (err) {
            console.error('Logout API error:', err);
          }
        }

        set({ user: null, accessToken: null });
      },
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
