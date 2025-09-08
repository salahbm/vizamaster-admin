import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */

  // Explicitly set the root directory to resolve the lockfile warning
  turbopack: {
    root: path.join(process.cwd()),
  },
};

export default withNextIntl(nextConfig);
