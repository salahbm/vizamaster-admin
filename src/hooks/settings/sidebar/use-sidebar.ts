import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { TResponse } from '@/server/common/types';

import { Sidebar } from '../../../../generated/prisma';

export const getAllSidebar = async () => {
  const res = await agent.get<TResponse<Sidebar>>(`api/settings/sidebar`);

  return res;
};

/**
 * Hook for fetching all sidebars
 */
export const useSidebar = () =>
  useQuery({
    queryFn: getAllSidebar,
    queryKey: QueryKeys.settings.sidebar.all,
    placeholderData: keepPreviousData,
  });
