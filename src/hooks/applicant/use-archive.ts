import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '../common/use-mutation';

const archiveApplicants = async (ids: string[]) => {
  return await agent.patch(`api/applicant/archive?ids=${ids.join(',')}`);
};

export const useArchiveApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveApplicants,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.applicants.all });
      },
    },
  });
};

const unarchiveApplicants = async (ids: string[]) => {
  return await agent.patch(`api/applicant/un-archive?ids=${ids.join(',')}`);
};

export const useUnarchiveApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unarchiveApplicants,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.applicants.all });
      },
    },
  });
};
