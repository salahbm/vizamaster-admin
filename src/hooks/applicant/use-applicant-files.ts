import { keepPreviousData, useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

// ───────────────── GET ────────────────── //
export const getApplicantFiles = async (id?: string): Promise<File[]> => {
  const { data } = await agent.get<TResponse<File[]>>(
    `api/applicant/${id}/files`,
  );

  if (!data) throw new NotFoundError('Applicant files not found');

  return data;
};

/**
 * Hook for fetching a applicant files by ID
 */
export const useApplicantFiles = (id?: string) =>
  useQuery({
    queryFn: () => getApplicantFiles(id),
    queryKey: [...QueryKeys.applicants.files, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
