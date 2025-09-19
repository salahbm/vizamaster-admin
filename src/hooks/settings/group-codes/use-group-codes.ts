import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { GroupCodes } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { PaginatedResult, TResponse } from '@/server/common/types';

type TGroupCodesParams = {
  page: number;
  size: number;
  search?: string;
  sort?: ColumnSort[];
};

export const getAllGroupCodes = async (
  params: TGroupCodesParams,
): Promise<PaginatedResult<GroupCodes>> => {
  const queries = objectToSearchParams(params);
  const response = await agent.get<TResponse<PaginatedResult<GroupCodes>>>(
    `api/settings/group-codes?${queries}`,
  );

  if (!response.data) throw new NotFoundError('Group codes not found');

  return response.data;
};

/**
 * Hook for fetching all group codes
 */
export const useGroupCodes = (params: TGroupCodesParams) =>
  useQuery({
    queryFn: () => getAllGroupCodes(params),
    queryKey: [...QueryKeys.settings.groupCodes.all, { ...params }],
    placeholderData: keepPreviousData,
  });
