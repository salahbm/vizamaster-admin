import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { User } from 'better-auth';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Sidebar } from '@/generated/prisma';
import { API_CODES } from '@/server/common/codes';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';
import { useAuthStore } from '@/store/auth-store';

export const getAllSidebar = async (id?: string): Promise<Sidebar[]> => {
  if (!id) return [];

  const userRes = await agent.get<TResponse<User>>(
    `api/admins/find-user?id=${id}`,
  );

  if (!userRes.data)
    throw new NotFoundError('User not found', API_CODES.NOT_FOUND);

  const { data } = await agent.get<TResponse<Sidebar[]>>(
    `api/settings/sidebar/admin-sidebars?userId=${userRes.data.id}`,
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
  });
};
