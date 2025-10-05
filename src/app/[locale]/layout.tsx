import React, { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Viewport } from 'next';
import { hasLocale } from 'next-intl';

import Loader from '@/components/ui/loader';

import { cn } from '@/lib/utils';

import { BRAND } from '@/constants/brand';
import { manrope } from '@/constants/fonts';

import { routing } from '@/i18n/routing';
import RootLayout from '@/providers/root';
import '@/styles/globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title', { brand: BRAND.name }),
    description: t('description', { brand: BRAND.name }),
    metadataBase: new URL(`https://admin.brand.uz`),
    openGraph: {
      title: t('title', { brand: BRAND.name }),
      description: t('description', { brand: BRAND.name }),
    },
    twitter: {
      title: t('title', { brand: BRAND.name }),
      description: t('description', { brand: BRAND.name }),
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: ['admin', 'dashboard'],
    icons: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fff',
  colorScheme: 'light',
};

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
      <body className={cn('overflow-hidden font-sans', manrope.className)}>
        <Suspense fallback={<Loader />}>
          <RootLayout>{children}</RootLayout>
        </Suspense>
      </body>
    </html>
  );
}
