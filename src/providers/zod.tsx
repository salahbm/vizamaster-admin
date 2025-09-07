'use client';

import { useEffect } from 'react';

import { useLocale } from 'next-intl';
import * as z from 'zod';

const ZodInitProvider = () => {
  const locale = useLocale();

  useEffect(() => {
    z.config(z.locales[locale as keyof typeof z.locales]());
  }, [locale]);

  return null;
};
export default ZodInitProvider;
