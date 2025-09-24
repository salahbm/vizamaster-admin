import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { FileType } from '@/generated/prisma';

import useMutation from '../common/use-mutation';

const deleteFile = async ({
  fileKey,
  applicantId,
  fileType,
}: {
  fileKey: string;
  applicantId: string;
  fileType: FileType;
}): Promise<void> => {
  await agent.delete(
    `/api/files/delete?fileKey=${fileKey}&applicantId=${applicantId}&fileType=${fileType}`,
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
            ...QueryKeys.files.preview,
            { applicantId: variables.applicantId },
          ],
        }),
    },
  });
};
