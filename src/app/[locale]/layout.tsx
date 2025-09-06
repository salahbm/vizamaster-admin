import React, { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Loader from '@/components/ui/loader';
import { routing } from '@/i18n/routing';
import RootLayout from '@/providers/root';

import '@/styles/globals.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(`http://localhost:3000`),
  };
}

export default async function IndexLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Suspense fallback={<Loader />}>
          <RootLayout>{children}</RootLayout>
        </Suspense>
      </body>
    </html>
  );
}
