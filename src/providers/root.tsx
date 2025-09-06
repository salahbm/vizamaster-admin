import { PropsWithChildren } from 'react';

import Internationalization from './intl';
import ThemeProvider from './theme';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Internationalization>{children}</Internationalization>
    </ThemeProvider>
  );
}
