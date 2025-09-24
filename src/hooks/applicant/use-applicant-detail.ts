import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Applicant } from '@/generated/prisma';
import { TApplicantDto } from '@/server/common/dto/applicant.dto';
import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';
import { useAuthStore } from '@/store/auth-store';

import useMutation from '../common/use-mutation';

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

// Update applicant
export const updateApplicant = async (
  body: TApplicantDto & { id: string },
  updatedBy: string,
): Promise<TResponse<Applicant>> => {
  return await agent.put<TResponse<Applicant>>(`api/applicant/${body.id}`, {
    ...body,
    updatedBy,
  });
};

export const useUpdateApplicant = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: (body: TApplicantDto & { id: string }) =>
      updateApplicant(body, user?.email!),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.applicants.details, { id: data.data?.id }],
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.applicants.all,
          type: 'all',
        });
      },
    },
  });
};
