import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { User } from 'better-auth';
import { useLocale } from 'next-intl';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { API_CODES } from '@/server/common/codes';
import { SignInSchema } from '@/server/common/dto';
import { UnauthorizedError } from '@/server/common/errors';
import { getErrorMessage } from '@/server/common/utils';
import { useAuthStore } from '@/store/auth-store';

const login = async (body: SignInSchema, locale: 'en' | 'ru') => {
  const { error, data } = await authClient.signIn.email({
    email: body.email,
    password: body.password,
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

  return data;
};

const useLogin = () => {
  const router = useRouter();
  const locale = useLocale();
  const { setUser, setAuthenticated } = useAuthStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInSchema) => login(data, locale as 'en' | 'ru'),
    options: {
      onSuccess: (data) => {
        setUser(data?.user as User);
        setAuthenticated(true);
        // On login success:
        queryClient.clear(); // wipes *all* cache

        // Or, if you want more control:
        queryClient.invalidateQueries(); // refetches all active queries
        router.push(routes.dashboard);
      },
      meta: {
        toast: false,
      },
    },
  });
};

export { useLogin };
