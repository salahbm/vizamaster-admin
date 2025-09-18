import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';
import { ISort } from '@/types/data-table';

import { Sidebar } from '../../../../generated/prisma';

interface IParams {
  sort?: ISort | ISort[];
}

// GET
export const getSideBarTable = async (params?: IParams): Promise<Sidebar[]> => {
  const query = objectToSearchParams(params as Record<string, unknown>);
  const { data } = await agent.get<TResponse<Sidebar[]>>(
    `api/settings/sidebar?${query}`,
  );

  if (!data) throw new NotFoundError('Sidebar not found');

  return data;
};

export const useSidebarTable = (params?: IParams) =>
  useQuery({
    queryFn: () => getSideBarTable(params),
    queryKey: [...QueryKeys.settings.sidebar.table, { ...params }],
    placeholderData: keepPreviousData,
  });
