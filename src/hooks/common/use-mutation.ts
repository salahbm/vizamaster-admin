import {
  type MutationFunction,
  type UseMutationOptions,
  type UseMutationResult,
  useMutation as useDefaultMutation,
} from '@tanstack/react-query';

import { TResponse } from '@/server/common/types';

export type IMutationOptions<T, V = T> = Omit<
  UseMutationOptions<T, TResponse<T>, V>,
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
  TResponse<TData>,
  TVariables
> => useDefaultMutation({ mutationFn, ...options });

export default useMutation;
