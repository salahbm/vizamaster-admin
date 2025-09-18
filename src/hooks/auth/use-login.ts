import { useRouter } from 'next/navigation';

import { useLocale } from 'next-intl';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { API_CODES } from '@/server/common/codes';
import { SignInSchema } from '@/server/common/dto';
import { UnauthorizedError } from '@/server/common/errors';
import { getErrorMessage } from '@/server/common/utils';

const login = async (data: SignInSchema, locale: 'en' | 'ru') => {
  const { error } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  // Handle auth errors
  if (error?.code) {
    const localizedMessage = getErrorMessage(error.code, locale);

    // Create an API error response
    const apiError = new UnauthorizedError(
      localizedMessage || error.message || 'Invalid email or password',
      API_CODES.INVALID_CREDENTIALS,
    );

    // Return error response in the format expected by useError hook
    throw {
      status: apiError.status,
      code: apiError.code,
      message: apiError.message,
      data: null,
    };
  }
};

const useLogin = () => {
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: (data: SignInSchema) => login(data, locale as 'en' | 'ru'),
    options: {
      onSuccess: () => router.push(routes.dashboard),
      meta: {
        toast: false,
      },
    },
  });
};

export { useLogin };
