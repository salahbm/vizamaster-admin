import { useRouter } from 'next/navigation';

import { ErrorContext } from 'better-auth/react';
import Cookies from 'js-cookie';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { handleApiError } from '@/server/common/errors';

const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      authClient.signOut(
        {
          fetchOptions: {
            onSuccess: () => {
              router.push(routes.signIn);
            },
          },
        },
        {
          onError: (e: ErrorContext) => {
            console.warn(e);
            Cookies.remove('better-auth.session_token');
            router.push(routes.signIn);
            throw handleApiError(e.error.message, e.error.status, e.error.code);
          },
        },
      );
    },
  });
};

export { useLogout };
