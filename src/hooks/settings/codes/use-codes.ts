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
export const useCodes = (params: TCodesParams) =>
  useQuery({
    queryFn: () => getAllCodes(params),
    queryKey: [...QueryKeys.settings.codes.all, { ...params }],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

// New function to fetch ALL codes by looping through pages
export const fetchAllCodes = async (): Promise<Codes[]> => {
  let allCodes: Codes[] = [];
  let page = 1;
  const size = 100; // Adjust based on your API limits; keeps requests efficient

  while (true) {
    const params: TCodesParams = { page, size };
    const response = await getAllCodes(params);
    allCodes = [...allCodes, ...response.data];

    // Assuming PaginatedResult has a 'data' array; stop if incomplete page
    if (response.data.length < size) {
      break;
    }

    page++;
  }

  return allCodes;
};

/**
 * New hook for fetching ALL codes upfront and storing them
 */
export const useAllCodes = () => {
  const { setCodes } = useCodesStore();

  const query = useQuery({
    queryFn: fetchAllCodes,
    queryKey: [QueryKeys.settings.codes.all], // Use a distinct key if needed
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Update store with all codes
  useEffect(() => {
    if (query.data) {
      setCodes(query.data);
    }
  }, [query.data, setCodes]);

  return query;
};
