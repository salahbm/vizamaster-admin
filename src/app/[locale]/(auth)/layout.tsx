import { Fragment } from 'react';

import { Viewport } from 'next';

import HeaderLogin from '@/components/shared/header/login-header';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <HeaderLogin />
      {children}
    </Fragment>
  );
}
