import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { API_CODES } from '@/server/common/codes';
import { InternalServerError } from '@/server/common/errors';
import { getErrorMessage } from '@/server/common/utils';

const useLogout = () => {
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut(
        {
          fetchOptions: {
            onSuccess: () => {
              router.push(routes.signIn);
            },
          },
        },
        {
          onError: () => {
            Cookies.remove('better-auth.session_token');
            router.push(routes.signIn);
          },
        },
      );
      // Handle auth errors
      if (error?.code) {
        const localizedMessage = getErrorMessage(
          error.code,
          locale as 'en' | 'ru',
        );

        // Create an API error response
        const apiError = new InternalServerError(
          localizedMessage || error.message || 'Something went wrong',
          API_CODES.SERVER_ERROR,
        );

        // Return error response in the format expected by useError hook
        throw {
          status: apiError.status,
          code: apiError.code,
          message: apiError.message,
          data: null,
        };
      }
    },
  });
};

export { useLogout };
