import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '../common/use-mutation';

const deleteAdmin = async (id: string) => {
  return await agent.delete(`api/admins/${id}`);
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.admins.all });
      },
    },
  });
};
