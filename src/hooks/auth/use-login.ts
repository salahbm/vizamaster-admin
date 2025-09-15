import { useRouter } from 'next/navigation';

import { ErrorContext } from 'better-auth/react';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { SignInSchema } from '@/server/common/dto';
import { handleApiError } from '@/server/common/errors';

const login = (data: SignInSchema) =>
  authClient.signIn.email(
    {
      email: data.email,
      password: data.password,
    },
    {
      onError: (e: ErrorContext) => {
        console.warn(e);
        throw handleApiError(e.error.message, e.error.status, e.error.code);
      },
    },
  );

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    options: {
      onSuccess: () => router.push(routes.dashboard),
      meta: {
        toast: false,
      },
    },
  });
};

export { useLogin };
