'use client';

import { PropsWithChildren, useState } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useError } from '@/hooks/common/use-error';
import { ApiError } from '@/server/common/errors';

const isErrorData = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

/**
 * @file query-provider.tsx
 * @description Query provider for react query
 * @author Salah
 * @date 2025-08-06
 */

const QueryProvider = ({ children }: PropsWithChildren) => {
  const { errorHandler } = useError();
  const t = useTranslations();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
          mutations: {
            retry: 0,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.warn(
              `Error in query: ${JSON.stringify(query.queryKey)}`,
              error,
            );
            if (isErrorData(error)) return errorHandler(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: Error | ApiError) => {
            console.warn('Mutation error:', error ?? 'Unknown error');
            if (isErrorData(error)) return errorHandler(error);
          },

          onSuccess: (
            data: unknown,
            _variables: unknown,
            _context: unknown,
            mutation: { meta?: { toast?: boolean } },
          ) => {
            // pass toast: false to disable toast default behavior is true
            if (data && mutation.meta?.toast !== false)
              return toast.success(
                t('Common.messages.success', {
                  fallback: (data as ApiError).message,
                }),
              );
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
