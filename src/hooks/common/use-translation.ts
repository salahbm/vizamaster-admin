'use client';

import { useCallback, useTransition } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';

import { COOKIE_KEYS } from '@/constants/cookies';

import { Locale, routing } from '@/i18n/routing';

const useTranslation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  //   const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const { locales } = routing;

  const handleLocale = useCallback(
    (value: string) => {
      Cookies.set(COOKIE_KEYS.LANGUAGE, value, { expires: 365 });

      const segments = pathname.split('/');
      const currentLangIndex = locales.includes(segments[1] as Locale)
        ? 1
        : null;

      if (currentLangIndex !== null) {
        segments[1] = value;
      } else {
        segments.unshift(value);
      }

      const newPath = segments.join('/');

      // Transition navigation
      startTransition(() => {
        router.replace(newPath);
        router.refresh();
      });

      // Refetch all queries
      //   queryClient.invalidateQueries();
    },
    [pathname, router, locales, startTransition],
  );

  return { locales, currentLocale, handleLocale, isPending };
};

export default useTranslation;
