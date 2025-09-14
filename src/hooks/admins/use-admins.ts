import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { PaginatedResult } from '@/server/common/types';

import { Users } from '../../../generated/prisma';

type TAdminParams = {
  page: number;
  size: number;
  search?: string;
};

const getAdmins = async (
  params: TAdminParams,
): Promise<PaginatedResult<Users>> => {
  const { data } = await agent.getPaginated(
    'api/admins',
    params.page,
    params.size,
    params.search,
  );
  return data as unknown as PaginatedResult<Users>;
};

/**
 * Hook for fetching admin users with pagination and search
 */
export const useAdmins = (params: TAdminParams) =>
  useQuery({
    queryFn: () => getAdmins(params),
    queryKey: [QueryKeys.admins.all, params],
    placeholderData: keepPreviousData,
  });
