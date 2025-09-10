import { PropsWithChildren } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import Internationalization from './intl';
import IntlErrorHandlingProvider from './intl-error';
import ThemeProvider from './theme';
import ZodInitProvider from './zod';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Internationalization>
        <IntlErrorHandlingProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <ZodInitProvider />
        </IntlErrorHandlingProvider>
      </Internationalization>
    </ThemeProvider>
  );
}
