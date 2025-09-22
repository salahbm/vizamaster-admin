import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Work } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getApplicantWork = async (id?: string): Promise<Work> => {
  const { data } = await agent.get<TResponse<Work>>(`api/applicant/${id}/work`);

  if (!data) throw new NotFoundError('Applicant work not found');

  return data;
};

/**
 * Hook for fetching a applicant work by ID
 */
export const useApplicantWork = (id?: string) =>
  useQuery({
    queryFn: () => getApplicantWork(id),
    queryKey: [...QueryKeys.applicants.work, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
