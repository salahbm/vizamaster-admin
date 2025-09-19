import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { GroupCodes } from '@/generated/prisma';
import useMutation from '@/hooks/common/use-mutation';
import { TGroupCodesDto } from '@/server/common/dto/group-codes.dto';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getGroupCodeById = async (id?: string): Promise<GroupCodes> => {
  const { data } = await agent.get<TResponse<GroupCodes>>(
    `api/settings/group-codes/${id}`,
  );

  if (!data) throw new NotFoundError('Group code not found');

  return data;
};

/**
 * Hook for fetching a group code by ID
 */
export const useGroupCodeDetail = (id?: string) =>
  useQuery({
    queryFn: () => getGroupCodeById(id),
    queryKey: [...QueryKeys.settings.groupCodes.details, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

// ───────────────── CREATE ────────────────── //
export const createGroupCode = async (groupCode: TGroupCodesDto) =>
  await agent.post<TResponse<GroupCodes>>(
    'api/settings/group-codes',
    groupCode,
  );

export const useCreateGroupCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroupCode,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.groupCodes.all,
          type: 'all',
        });
      },
    },
  });
};

// ───────────────── UPDATE ────────────────── //
export const updateGroupCodeById = async (
  groupCode: TGroupCodesDto & { id: string },
) =>
  await agent.put<TResponse<GroupCodes>>(
    `api/settings/group-codes/${groupCode.id}`,
    groupCode,
  );

export const useUpdateGroupCodeById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroupCodeById,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.groupCodes.all,
          type: 'all',
        });
      },
    },
  });
};

// ───────────────── DELETE ────────────────── //
export const deleteGroupCodeById = async (id: string) =>
  await agent.delete<TResponse<GroupCodes>>(`api/settings/group-codes/${id}`);

export const useDeleteGroupCodeById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroupCodeById,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.groupCodes.all,
        }),
    },
  });
};
