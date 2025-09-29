import { authClient } from '@/lib/auth-client';

import useMutation from '../common/use-mutation';

export const useResetPassword = () =>
  useMutation({
    mutationFn: async ({
      email,
      redirectTo,
    }: {
      email: string;
      redirectTo: string;
    }) =>
      await authClient.requestPasswordReset({
        email,
        redirectTo,
      }),
  });
