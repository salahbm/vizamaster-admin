import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { ResetPasswordView } from '@/components/views/auth/reset-password';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
