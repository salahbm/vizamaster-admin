import { useCallback, useMemo } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { routes } from '@/constants/routes';

import { useAlert } from '@/providers/alert';
import { API_CODES } from '@/server/common/codes';
import { ApiError } from '@/server/common/errors';

export const useError = () => {
  const alert = useAlert();
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();

  const isSignInPage = useMemo(
    () => pathname.includes(routes.signIn),
    [pathname],
  );

  const errorHandler = useCallback(
    (error: ApiError) => {
      const { message, code } = error;

      /** When reset password token is expired */
      if (code === API_CODES.UNAUTHORIZED && !isSignInPage) {
        return alert({
          title: t('Common.messages.unauthorized'),
          description: message,
          icon: 'error',
          cancelButton: null,
          confirmText: t('Common.signIn'),
          onConfirm: () => {},
        });
      }

      return alert({
        title: t('Common.messages.error'),
        description: message,
        icon: 'error',
        cancelButton: null,
        confirmText: t('Common.goBack'),
        onConfirm: () => router.back(),
      });
    },
    [alert, t, isSignInPage, router],
  );

  return {
    errorHandler,
  };
};
