'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/input';

import { authClient } from '@/lib/auth-client';

export function ResetPasswordView() {
  const t = useTranslations('auth.resetPassword');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(8),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!token) {
      toast.error(t('invalidToken'));
    }
  }, [token, t]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      const response = await authClient.resetPassword({
        token,
        newPassword: data.newPassword,
      });

      if (response.error) {
        throw response.error;
      }

      toast.success(t('passwordResetSuccess'));
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(t('passwordResetError'));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-header text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormFields
              control={form.control}
              name="newPassword"
              label={t('newPasswordLabel')}
              render={({ field }) => (
                <PasswordInput
                  type="password"
                  placeholder={t('newPasswordPlaceholder')}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            <FormFields
              control={form.control}
              name="confirmPassword"
              label={t('confirmPasswordLabel')}
              render={({ field }) => (
                <PasswordInput
                  type="password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  {t('resetButton')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
