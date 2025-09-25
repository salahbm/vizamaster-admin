import { useMutation, useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Work } from '@/generated/prisma';
import { TWorkArraySchema } from '@/server/common/dto/work.dto';
import { TResponse } from '@/server/common/types';

// ───────────────── PUT ────────────────── //
export const updateApplicantWork = async (
  id: string,
  work: TWorkArraySchema,
): Promise<Work[]> => {
  const { data } = await agent.put<TResponse<Work[]>>(
    `api/applicant/${id}/work`,
    work,
  );
  return data || [];
};

// ───────────────── DELETE ────────────────── //
export const deleteApplicantWork = async (
  id: string,
  applicantId: string,
): Promise<Work[]> => {
  if (!id) return [];

  const { data } = await agent.delete<TResponse<Work[]>>(
    `api/applicant/${id}/work?applicantId=${applicantId}`,
  );
  return data || [];
};

/**
 * Hook for fetching and updating applicant work experience
 */
export const useApplicantWork = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (work: TWorkArraySchema) => updateApplicantWork(id, work),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QueryKeys.applicants.details, { id }],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (workId: string) => deleteApplicantWork(workId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QueryKeys.applicants.details, { id }],
      });
    },
  });

  return {
    updateWork: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
    deleteWork: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
