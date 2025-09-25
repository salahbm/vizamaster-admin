import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import agent from '@/lib/agent';
import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import { Users } from '@/generated/prisma';
import useMutation from '@/hooks/common/use-mutation';
import { API_CODES } from '@/server/common/codes';
import { SignInSchema } from '@/server/common/dto';
import { NotFoundError, UnauthorizedError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';
import { getErrorMessage } from '@/server/common/utils';
import { useAuthStore } from '@/store/use-auth-store';

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

  const user = await agent.get<TResponse<Users>>(
    `/api/admins/find-user?id=${data?.user.id}`,
  );

  if (!user) throw new NotFoundError('User not found');

  return user?.data;
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
        setUser(data as Users);
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
