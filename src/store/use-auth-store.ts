import { User } from 'better-auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  removeUser: () => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      user: null,
      setUser: (user) => set({ user }),
      removeUser: () => set({ user: null, isAuthenticated: false }),
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),

    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
