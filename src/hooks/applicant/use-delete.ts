import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '../common/use-mutation';

const deleteApplicants = async (ids: string[]) => {
  return await agent.delete(`api/applicant?ids=${ids.join(',')}`);
};

export const useDeleteApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplicants,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.applicants.all });
      },
    },
  });
};
