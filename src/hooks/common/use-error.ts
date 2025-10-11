// hooks/common/use-error.ts
import { useCallback, useMemo } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

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
      const { message, code, data } = error;

      /** Handle specific error codes */
      switch (code) {
        case API_CODES.UNAUTHORIZED: // e.g., 4010
          if (!isSignInPage) {
            return alert({
              title: t('Common.messages.unauthorized'),
              description: message,
              icon: 'error',
              cancelButton: null,
              confirmText: t('Common.signIn'),
              onConfirm: () => {
                router.push(routes.signIn); // Redirect to sign-in
              },
            });
          }
          break;

        case API_CODES.APPLICANT_ALREADY_EXISTS: // e.g., 4093
          return alert({
            title: t('Common.messages.applicantAlreadyExists'),
            description: t('Common.messages.applicantAlreadyExistsDescription'),
            icon: 'error',
            cancelText: t('Common.goBack'),
            confirmText: t('Common.ok'),
            onCancel: () => router.back(),
          });

        case API_CODES.VALIDATION_ERROR: // e.g., 4220
          return toast.error(
            data && data === Object && 'errors' in data && data.errors
              ? `${message}: ${Object.entries(data.errors)
                  .map(
                    ([field, msgs]) =>
                      `${field}: ${(msgs as string[])?.join(', ')}`,
                  )
                  .join('; ')}`
              : message,
          );
        case API_CODES.NOT_FOUND: // e.g., 4040
          return toast.error(t('Common.messages.notFound', { message }));
        case API_CODES.CONFLICT: // e.g., 4090
          return toast.error(t('Common.messages.conflict', { message }));
        default:
          return toast.error(message || t('Common.messages.unknownError'));
      }
    },
    [alert, t, isSignInPage, router],
  );

  return {
    errorHandler,
  };
};
