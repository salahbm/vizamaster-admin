import { PropsWithChildren } from 'react';

import Internationalization from './intl';

export default async function RootLayout({ children }: PropsWithChildren) {
  return <Internationalization>{children}</Internationalization>;
}
