import { useRouter } from 'next/navigation';

import { ErrorContext } from 'better-auth/react';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { SignUpSchema } from '@/server/common/dto';
import { handleApiError } from '@/server/common/errors';

const register = async (data: SignUpSchema) =>
  await authClient.signUp.email(
    {
      email: data.email,
      password: data.password,
      name: data.name,
    },
    {
      onError: (e: ErrorContext) => {
        console.warn(e);
        throw handleApiError(e.error.message, e.error.status, e.error.code);
      },
    },
  );

const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    options: {
      onSuccess: () => router.push(`${routes.success}?type=generic`),
      meta: {
        toast: false,
      },
    },
  });
};

export { useRegister };
