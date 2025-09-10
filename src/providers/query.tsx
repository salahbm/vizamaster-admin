'use client';

import { PropsWithChildren, useState } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ApiResponse } from '@/types/response';

const isErrorData = <T extends unknown>(
  error: unknown,
): error is ApiResponse<T> => {
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
            if (isErrorData(error)) return alert(error.message);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: Error | ApiResponse<unknown>) => {
            console.warn('Mutation error:', error ?? 'Unknown error');

            if (isErrorData(error)) return alert(error.message);
          },

          onSuccess: (
            data: unknown,
            _variables: unknown,
            _context: unknown,
            mutation: { meta?: { toast?: boolean } },
          ) => {
            console.info('Mutation success:', data);
            /**
             * @param toast:
             * pass toast: false to disable toast default behavior is true
             */
            // if (data && mutation.meta?.toast !== false)
            //   return toast.success((data as ApiResponse).message);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
