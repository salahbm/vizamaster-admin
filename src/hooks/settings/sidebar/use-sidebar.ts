import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

import { Sidebar } from '../../../../generated/prisma';

export const getAllSidebar = async (): Promise<Sidebar[]> => {
  const { data } =
    await agent.get<TResponse<Sidebar[]>>(`api/settings/sidebar`);
  if (!data) throw new NotFoundError('Sidebar not found');
  return data;
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
