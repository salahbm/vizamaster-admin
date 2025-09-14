import {
  type MutationFunction,
  type UseMutationOptions,
  type UseMutationResult,
  useMutation as useDefaultMutation,
} from '@tanstack/react-query';

import { IResponse } from '@/types/global';

export type IMutationOptions<T, V = T> = Omit<
  UseMutationOptions<T, IResponse<T>, V>,
  'queryKey' | 'queryFn'
>;

type UseMutationProps<TData, TVariables> = {
  mutationFn: MutationFunction<TData, TVariables>;
  options?: IMutationOptions<TData, TVariables>;
};

const useMutation = <TData, TVariables = TData>({
  mutationFn,
  options,
}: UseMutationProps<TData, TVariables>): UseMutationResult<
  TData,
  IResponse<TData>,
  TVariables
> => {
  const wrappedMutationFn = async (variables: TVariables) => {
    try {
      return await mutationFn(variables);
    } catch (error: unknown) {
      console.error('Mutation error:', error);

      // Convert error to a standardized format
      const apiError: IResponse<TData> = {
        status:
          error && typeof error === 'object' && 'status' in error
            ? (error.status as number)
            : 500,
        code:
          error && typeof error === 'object' && 'code' in error
            ? (error.code as number)
            : 5000,
        message:
          error && typeof error === 'object' && 'message' in error
            ? String(error.message)
            : 'An unexpected error occurred',
        data: null as unknown as TData,
      };

      throw apiError;
    }
  };

  return useDefaultMutation({ mutationFn: wrappedMutationFn, ...options });
};

export default useMutation;
