// hooks/use-codes.ts
import { useEffect } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { Codes } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { PaginatedResult, TResponse } from '@/server/common/types';
import { IExtendedCodes, useCodesStore } from '@/store/use-codes-store';

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

export const fetchAllCodes = async (): Promise<Codes[]> => {
  let allCodes: Codes[] = [];
  let page = 1;
  const size = 100;

  while (true) {
    const response = await getAllCodes({ page, size });
    allCodes = [...allCodes, ...response.data];
    if (response.data.length < size) break;
    page++;
  }

  return allCodes;
};

export const useAllCodes = () => {
  const { setCodes } = useCodesStore();

  const { data } = useQuery({
    queryFn: fetchAllCodes,
    queryKey: QueryKeys.settings.codes.all,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 1h cache
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) setCodes(data as IExtendedCodes[]);
  }, [data, setCodes]);

  return data;
};
