import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Sidebar } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';
import { useAuthStore } from '@/store/use-auth-store';

export const getAllSidebar = async (id?: string): Promise<Sidebar[]> => {
  if (!id) return [];

  // Direct API call without the extra user lookup to avoid unnecessary requests
  const { data } = await agent.get<TResponse<Sidebar[]>>(
    `api/settings/sidebar/admin-sidebars?userId=${id}`,
    // { cache: 'force-cache' },
  );

  if (!data) throw new NotFoundError('Sidebar not found');

  return data;
};

/**
 * Hook for fetching all sidebars
 */
export const useSidebar = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryFn: () => getAllSidebar(user?.id),
    queryKey: [...QueryKeys.settings.sidebar.all, { userId: user?.id }],
    placeholderData: keepPreviousData,
    // staleTime: Infinity, // trust cache until explicitly invalidated
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useSidebarOptions = (id?: string) =>
  useQuery({
    queryFn: () => getAllSidebar(id),
    queryKey: [...QueryKeys.settings.sidebar.options, { userId: id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
