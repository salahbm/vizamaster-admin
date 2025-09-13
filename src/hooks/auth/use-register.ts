import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/lib/auth-client';

import { routes } from '@/constants/routes';

import { SignUpSchema } from '@/server/common/dto';

const register = (data: SignUpSchema) =>
  signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });

const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: () => router.push(routes.signIn),
  });
};

export { useRegister };
