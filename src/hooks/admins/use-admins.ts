import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { PaginatedResult, TResponse } from '@/server/common/types';

import { Users } from '../../../generated/prisma';

type TAdminParams = {
  page: number;
  size: number;
  search?: string;
  sort?: ColumnSort[] | ColumnSort;
};

export const getAdmins = async (params: TAdminParams) => {
  const queries = objectToSearchParams(params);

  const { data } = await agent.get<TResponse<PaginatedResult<Users>>>(
    `api/admins?${queries}&include=sidebars`,
  );

  if (!data) throw new NotFoundError('Admins not found');

  return data;
};

/**
 * Hook for fetching admin users with pagination and search
 */
export const useAdmins = (params: TAdminParams) =>
  useQuery({
    queryFn: () => getAdmins(params),
    queryKey: [...QueryKeys.admins.all, { ...params }],
    placeholderData: keepPreviousData,
  });
