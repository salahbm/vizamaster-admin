import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '../common/use-mutation';

/**
 * Update an admin user's sidebars using the API agent
 */
const update = async ({
  id,
  data,
}: {
  id: string;
  data: { sidebarIds: string[] };
}) => agent.patch(`api/admins/${id}/sidebars`, data);

/**
 * Hook for updating admin user's sidebars
 */
export const useUpdateAdminSidebars = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: update,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: QueryKeys.admins.all,
        }),
    },
  });
};
