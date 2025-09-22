import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Visa } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getApplicantVisa = async (id?: string): Promise<Visa> => {
  const { data } = await agent.get<TResponse<Visa>>(`api/applicant/${id}/visa`);

  if (!data) throw new NotFoundError('Applicant visa not found');

  return data;
};

/**
 * Hook for fetching a applicant visa by ID
 */
export const useApplicantVisa = (id?: string) =>
  useQuery({
    queryFn: () => getApplicantVisa(id),
    queryKey: [...QueryKeys.applicants.visa, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
