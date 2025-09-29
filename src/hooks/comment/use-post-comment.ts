import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { TResponse } from '@/server/common/types';
import { useAuthStore } from '@/store/use-auth-store';

import useMutation from '../common/use-mutation';
import { CommentWithAuthor } from './use-comments';

type CommentsQueryData = {
  pages: Array<{
    data: CommentWithAuthor[];
    nextCursor?: string;
  }>;
  pageParams: Array<string | undefined>;
};

type MutationContext = {
  previousData: CommentsQueryData | undefined;
};

/**
 * Hook for creating a new comment
 */
export const useCreateComment = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      applicantId,
    }: {
      content: string;
      applicantId: string;
    }) =>
      await agent.post<TResponse<CommentWithAuthor>>(
        `/api/applicant/${applicantId}/comments`,
        { content },
      ),
    options: {
      onMutate: async ({
        content,
        applicantId,
      }: {
        content: string;
        applicantId: string;
      }) => {
        await queryClient.cancelQueries({
          queryKey: [...QueryKeys.applicants.comments, { applicantId }],
        });

        // Get the previous infinite query data
        const previousData = queryClient.getQueryData<CommentsQueryData>([
          ...QueryKeys.applicants.comments,
          { applicantId },
        ]);

        // Optimistically update the first page with the new comment
        queryClient.setQueryData(
          [...QueryKeys.applicants.comments, { applicantId }],
          (oldData: { pages: Array<{ data: CommentWithAuthor[] }> }) => {
            if (!oldData?.pages?.[0]) return oldData;

            // Create a new comment
            const newComment = {
              id: 'temp-' + Date.now(),
              content,
              applicantId,
              authorId: user?.id || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isSent: true,
              author: {
                id: user?.id || '',
                name: user?.name,
              },
            };

            // Update the first page with the new comment
            const newData = {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  data: [newComment, ...oldData.pages[0].data],
                },
                ...oldData.pages.slice(1), // Keep the rest of the pages
              ],
            };

            return newData;
          },
        );

        return { previousData };
      },
      onSuccess: (_, variables) => {
        // Invalidate comments query to refetch
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.comments,
            { applicantId: variables.applicantId },
          ],
          exact: true,
        });

        // Also invalidate alerts since a new comment creates alerts
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.alerts.unread, { userId: user?.id }],
          type: 'all',
        });
      },

      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (_err, variables, context: unknown) => {
        const mutationContext = context as MutationContext;
        if (mutationContext?.previousData) {
          queryClient.setQueryData(
            [
              ...QueryKeys.applicants.comments,
              { applicantId: variables.applicantId },
            ],
            mutationContext.previousData,
          );
        }
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.comments,
            { applicantId: variables.applicantId },
          ],
          exact: true,
        });
      },
    },
  });
};
