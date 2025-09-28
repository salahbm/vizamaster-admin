import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { TResponse } from '@/server/common/types';

import useMutation from '../common/use-mutation';
import { CommentWithAuthor } from './use-comments';

const postComment = async ({
  content,
  applicantId,
}: {
  content: string;
  applicantId: string;
}) => {
  const { data } = await agent.post<TResponse<CommentWithAuthor>>(
    `/api/applicant/${applicantId}/comments`,
    { content },
  );
  return data;
};

/**
 * Hook for creating a new comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      applicantId,
    }: {
      content: string;
      applicantId: string;
    }) => postComment({ content, applicantId }),
    options: {
      onSuccess: (_, variables) => {
        // Invalidate comments query to refetch
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.comments,
            { applicantId: variables.applicantId },
          ],
        });

        // Also invalidate alerts since a new comment creates alerts
        queryClient.invalidateQueries({
          queryKey: QueryKeys.alerts.unread,
        });
      },
    },
  });
};
