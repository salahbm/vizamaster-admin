import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Users } from '@/generated/prisma';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: Users | null;
  setUser: (user: Users | null) => void;
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
