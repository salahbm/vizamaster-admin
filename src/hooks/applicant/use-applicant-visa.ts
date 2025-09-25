import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Visa } from '@/generated/prisma';
import { TVisaDto } from '@/server/common/dto/visa.dto';
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
// ───────────────── UPDATE ────────────────── //
export const updateApplicantVisa = async (
  id: string,
  data: TVisaDto,
): Promise<Visa> => {
  const response = await agent.put<TResponse<Visa>>(
    `api/applicant/${id}/visa`,
    data,
  );
  if (!response.data) throw new NotFoundError('Failed to update visa');
  return response.data;
};

// ───────────────── HOOKS ────────────────── //
export const useApplicantVisa = (id?: string) =>
  useQuery({
    queryFn: () => getApplicantVisa(id),
    queryKey: [...QueryKeys.applicants.visa, { id }],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

export const useUpdateApplicantVisa = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TVisaDto) => updateApplicantVisa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QueryKeys.applicants.visa, { id }],
      });
    },
  });
};
