import { useRouter } from 'next/navigation';

import { useLocale } from 'next-intl';

import { authClient } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import useMutation from '@/hooks/common/use-mutation';
import { API_CODES } from '@/server/common/codes';
import { SignUpSchema } from '@/server/common/dto';
import { InternalServerError } from '@/server/common/errors';
import { getErrorMessage } from '@/server/common/utils';

const register = async (data: SignUpSchema, locale: string) => {
  const { error } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });
  // Handle auth errors
  if (error?.code) {
    const localizedMessage = getErrorMessage(error.code, locale as 'en' | 'ru');

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
};

const useRegister = () => {
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: (data: SignUpSchema) => register(data, locale),
    options: {
      onSuccess: () => router.push(`${routes.success}?type=generic`),
      meta: {
        toast: false,
      },
    },
  });
};

export { useRegister };
