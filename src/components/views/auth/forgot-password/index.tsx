'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useResetPassword } from '@/hooks/auth';

// Form validation schema with translations
const forgotPasswordSchema = z.object({
  email: z.email(),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordView() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { mutateAsync, isPending } = useResetPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) =>
    await mutateAsync({
      email: data.email,
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-header">{t('forgotPassword.title')}</h1>
          <p className="font-body-2 text-muted-foreground mt-2">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields
              name="email"
              label={t('forgotPassword.emailLabel')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {t('forgotPassword.resetButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center">
              <Link
                href="/sign-in"
                className="text-primary font-body-2 inline-flex items-center hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('forgotPassword.backToSignIn')}
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
