// store/use-codes-store.ts
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { COOKIE_KEYS } from '@/constants/cookies';

import { Codes } from '@/generated/prisma';

export interface IExtendedCodes extends Codes {
  groupCode: string;
}

interface CodesStore {
  codes: IExtendedCodes[] | null;
  setCodes: (codes: IExtendedCodes[]) => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  getLabel: (code: string) => string;
  options: (
    groupCode: string,
    locale: string,
  ) => { value: string; label: string }[];
}

export const useCodesStore = create<CodesStore>()(
  persist(
    (set, get) => ({
      codes: [],
      setCodes: (codes: IExtendedCodes[]) =>
        set({
          codes: codes?.map((c) => ({ ...c, groupCode: c.groupCode })) ?? [],
        }),

      getLabel: (prop: string): string => {
        const locale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';
        const code = get().codes?.find((item) => item.code === prop);
        return code ? (locale === 'ru' ? code.labelRu : code.labelEn) : '-';
      },

      options: (groupCode: string, locale: string) => {
        const codes = get().codes?.filter(
          (item) => item.groupCode === groupCode,
        );
        return (
          codes?.map((item) => ({
            value: item.code,
            label: locale === 'ru' ? item.labelRu : item.labelEn,
          })) ?? []
        );
      },
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
    {
      name: 'codes',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ codes: state.codes }), // persist only codes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
