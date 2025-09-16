import { useRouter } from 'next/navigation';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '@/hooks/common/use-mutation';
import { CreateSidebarDto } from '@/server/common/dto';
import { TResponse } from '@/server/common/types';

import { Sidebar } from '../../../../generated/prisma';

// Get a single sidebar by ID
export const getSidebarById = async (id?: string) =>
  await agent.get<TResponse<Sidebar>>(`api/settings/sidebar/${id}`);

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

//   Create a new sidebar
export const createSidebar = async (sidebar: CreateSidebarDto) =>
  await agent.post<TResponse<Sidebar>>('api/settings/sidebar', sidebar);

export const useCreateSidebar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSidebar,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.all,
        }),
    },
  });
};

// Update a sidebar by ID
export const updateSidebarById = async (
  id: string,
  sidebar: CreateSidebarDto,
) => {
  console.log('Sending update with data:', sidebar);
  console.log('Data type:', typeof sidebar);
  console.log('Data stringified:', JSON.stringify(sidebar));

  // Make sure we're not sending an empty object
  if (!sidebar || Object.keys(sidebar).length === 0) {
    throw new Error('Cannot update with empty data');
  }

  return await agent.put<TResponse<Sidebar>>(
    `api/settings/sidebar/${id}`,
    sidebar,
  );
};

// Define a type for the mutation parameters
type UpdateSidebarParams = [string, CreateSidebarDto];

export const useUpdateSidebarById = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    // Use a wrapper function that accepts an array of parameters
    mutationFn: ([id, data]: UpdateSidebarParams) =>
      updateSidebarById(id, data),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.settings.sidebar.all,
        });
        router.back();
      },
    },
  });
};
