import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Prisma } from '../../../generated/prisma';
import useMutation from '../common/use-mutation';

/**
 * Update an admin user using the API agent
 */
const update = async ({
  id,
  data,
}: {
  id: string;
  data: Prisma.UsersUpdateInput;
}) => agent.patch(`api/admins/${id}`, data);

/**
 * Hook for updating admin user details
 */
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: update,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: QueryKeys.admins.all }),
    },
  });
};
