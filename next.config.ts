import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'admin-visamaster.b454579c13202e51837201ada96c0bbc.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Explicitly set the root directory to resolve the lockfile warning
  turbopack: {
    root: path.join(process.cwd()),
  },
};

export default withNextIntl(nextConfig);
