import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { COOKIE_KEYS } from '@/constants/cookies';

import { Codes } from '@/generated/prisma';

interface CodesStore {
  codes: Codes[];
  setCodes: (codes: Codes[]) => void;
  getLabel: (c: string) => string;
}

export const useCodesStore = create<CodesStore>()(
  persist(
    (set, get) => ({
      codes: [],
      setCodes: (codes: Codes[]) => set({ codes }),
      getLabel: (prop: string): string => {
        const locale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';
        const code = get().codes.find((item) => item.code === prop);
        return code ? (locale === 'ru' ? code?.labelRu : code?.labelEn) : '-';
      },
    }),
    {
      name: 'codes',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
