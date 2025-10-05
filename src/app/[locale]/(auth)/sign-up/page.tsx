import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { SignUpView } from '@/components/views/auth/sign-up';

import { BRAND } from '@/constants/brand';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return {
    title: t('signUp.title'),
    description: t('signUp.subtitle', { brand: BRAND.name }),
  };
}

export default function SignUpPage() {
  return <SignUpView />;
}
