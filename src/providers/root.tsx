import { PropsWithChildren } from 'react';

import Internationalization from './intl';
import IntlErrorHandlingProvider from './intl-error';
import ThemeProvider from './theme';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Internationalization>
        <IntlErrorHandlingProvider>{children}</IntlErrorHandlingProvider>
      </Internationalization>
    </ThemeProvider>
  );
}
