import { PropsWithChildren } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import Internationalization from './intl';
import IntlErrorHandlingProvider from './intl-error';
import QueryProvider from './query';
import ThemeProvider from './theme';
import ZodInitProvider from './zod';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Internationalization>
        <IntlErrorHandlingProvider>
          <QueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </QueryProvider>
          <ZodInitProvider />
        </IntlErrorHandlingProvider>
      </Internationalization>
    </ThemeProvider>
  );
}
