import { useRouter } from 'next/navigation';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Sidebar } from '@/generated/prisma';
import useMutation from '@/hooks/common/use-mutation';
import { TCreateSidebarDto, TUpdateSidebarDto } from '@/server/common/dto';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getSidebarById = async (id?: string): Promise<Sidebar> => {
  const { data } = await agent.get<TResponse<Sidebar>>(
    `api/settings/sidebar/${id}`,
  );

  if (!data) throw new NotFoundError('Sidebar not found');

  return data;
};

/**
 * Hook for fetching a sidebar by ID
 */
export const useSidebarDetail = (id?: string) =>
  useQuery({
    queryFn: () => getSidebarById(id),
    queryKey: [...QueryKeys.settings.sidebar.details, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

// ───────────────── CREATE ────────────────── //
export const createSidebar = async (sidebar: TCreateSidebarDto) =>
  await agent.post<TResponse<Sidebar>>('api/settings/sidebar', sidebar);

export const useCreateSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSidebar,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.all,
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.table,
        });
      },
    },
  });
};

// ───────────────── UPDATE ────────────────── //
export const updateSidebarById = async (sidebar: TUpdateSidebarDto) =>
  await agent.put<TResponse<Sidebar>>(
    `api/settings/sidebar/${sidebar.id}`,
    sidebar,
  );

export const useUpdateSidebarById = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateSidebarById,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.all,
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.table,
        });
        router.back();
      },
    },
  });
};

// ───────────────── DELETE ────────────────── //
export const deleteSidebarById = async (id: string) =>
  await agent.delete<TResponse<Sidebar>>(`api/settings/sidebar/${id}`);

export const useDeleteSidebarById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSidebarById,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.all,
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.table,
        });
      },
    },
  });
};
