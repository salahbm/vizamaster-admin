import { useEffect } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { Codes } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { PaginatedResult, TResponse } from '@/server/common/types';
import { useCodesStore } from '@/store/use-codes-store';

type TCodesParams = {
  page: number;
  size: number;
  search?: string;
  sort?: ColumnSort[];
  groupCodeId?: string;
  groupCode?: string;
};

export const getAllCodes = async (
  params: TCodesParams,
): Promise<PaginatedResult<Codes>> => {
  const queries = objectToSearchParams(params);
  const response = await agent.get<TResponse<PaginatedResult<Codes>>>(
    `api/settings/codes?${queries}`,
  );

  if (!response.data) throw new NotFoundError('Codes not found');

  return response.data;
};

/**
 * Hook for fetching all  codes
 */
export const useCodes = (params: TCodesParams) => {
  const { setCodes } = useCodesStore();
  const codes = useQuery({
    queryFn: () => getAllCodes(params),
    queryKey: [...QueryKeys.settings.codes.all, { ...params }],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Use useEffect to update the store state to avoid React state updates during render
  useEffect(() => {
    if (codes.data?.data && !codes.isFetching && !codes.isLoading)
      setCodes(codes.data.data);
  }, [codes.data, codes.isFetching, codes.isLoading, setCodes]);

  return codes;
};
