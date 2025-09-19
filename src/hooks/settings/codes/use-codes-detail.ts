import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Codes } from '@/generated/prisma';
import useMutation from '@/hooks/common/use-mutation';
import { TCodesDto } from '@/server/common/dto/codes.dto';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getCodeById = async (id?: string): Promise<Codes> => {
  const { data } = await agent.get<TResponse<Codes>>(
    `api/settings/codes/${id}`,
  );

  if (!data) throw new NotFoundError('Code not found');

  return data;
};

/**
 * Hook for fetching a group code by ID
 */
export const useCodeDetail = (id?: string) =>
  useQuery({
    queryFn: () => getCodeById(id),
    queryKey: [...QueryKeys.settings.codes.details, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

// ───────────────── CREATE ────────────────── //
export const createCode = async (code: TCodesDto) =>
  await agent.post<TResponse<Codes>>('api/settings/codes', code);

export const useCreateCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCode,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.codes.all,
          type: 'all',
        });
      },
    },
  });
};

// ───────────────── UPDATE ────────────────── //
export const updateCodeById = async (code: TCodesDto & { id: string }) =>
  await agent.put<TResponse<Codes>>(`api/settings/codes/${code.id}`, code);

export const useUpdateCodeById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCodeById,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.codes.all,
          type: 'all',
        });
      },
    },
  });
};

// ───────────────── DELETE ────────────────── //
export const deleteCodeById = async (id: string) =>
  await agent.delete<TResponse<Codes>>(`api/settings/codes/${id}`);

export const useDeleteCodeById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCodeById,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.codes.all,
        }),
    },
  });
};
