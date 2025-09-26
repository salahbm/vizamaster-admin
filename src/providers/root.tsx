import { PropsWithChildren } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';

import AlertProvider from './alert';
import Internationalization from './intl';
import IntlErrorHandlingProvider from './intl-error';
import QueryProvider from './query';
import ThemeProvider from './theme';
import ZodInitProvider from './zod';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Internationalization>
        <AlertProvider>
          <IntlErrorHandlingProvider>
            <QueryProvider>
              <NuqsAdapter>
                {children}
                <Toaster position="top-center" />
              </NuqsAdapter>
            </QueryProvider>
            <ZodInitProvider />
          </IntlErrorHandlingProvider>
        </AlertProvider>
      </Internationalization>
    </ThemeProvider>
  );
}
