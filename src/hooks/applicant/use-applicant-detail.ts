import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Applicant } from '@/generated/prisma';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getApplicantById = async (id?: string): Promise<Applicant> => {
  const { data } = await agent.get<TResponse<Applicant>>(`api/applicant/${id}`);

  if (!data) throw new NotFoundError('Applicant not found');

  return data;
};

/**
 * Hook for fetching a applicant by ID
 */
export const useApplicantDetail = (id?: string) =>
  useQuery({
    queryFn: () => getApplicantById(id),
    queryKey: [...QueryKeys.applicants.details, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
