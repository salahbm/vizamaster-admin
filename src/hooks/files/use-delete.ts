import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import useMutation from '../common/use-mutation';

const deleteFile = async ({
  fileKey,
  applicantId,
}: {
  fileKey: string;
  applicantId: string;
}): Promise<void> => {
  await agent.delete(
    `/api/files/delete?ids=${fileKey}&applicantId=${applicantId}`,
  );
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFile,
    options: {
      meta: { toast: false },
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.details,
            { id: variables.applicantId },
          ],
        }),
    },
  });
};
