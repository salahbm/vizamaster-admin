'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';

import { useRegister } from '@/hooks/auth';
import { SignUpSchema, signUpSchema } from '@/server/common/dto';

export function SignUpView() {
  const t = useTranslations('auth');

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutateAsync: register, isPending } = useRegister();

  const onSubmit = async (data: SignUpSchema) => await register(data);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-header">{t('signUp.title')}</h1>
          <p className="font-body-2 text-muted-foreground mt-2">
            {t('signUp.subtitle')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields
              name="name"
              label={t('signUp.usernameLabel')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('signUp.usernamePlaceholder')}
                  autoComplete="username"
                  disabled={isPending}
                  {...field}
                />
              )}
            />

            <FormFields
              name="email"
              label={t('signUp.emailLabel')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('signUp.emailPlaceholder')}
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              )}
            />

            <FormFields
              name="password"
              label={t('signUp.passwordLabel')}
              required
              message={t('validation.password.containsUppercase')}
              messageClassName="text-muted-foreground text-xs"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  placeholder={t('signUp.passwordPlaceholder')}
                  autoComplete="new-password"
                  disabled={isPending}
                  {...field}
                />
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t('signUp.buttonLoading') : t('signUp.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="font-caption-1 text-center">
              {t('signUp.haveAccount')}{' '}
              <Link href="/sign-in" className="text-primary hover:underline">
                {t('signUp.signInLink')}
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
