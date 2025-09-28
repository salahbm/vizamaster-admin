import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { TInfinityResponse } from '@/server/common/types';

// Type for comment with author
export interface CommentWithAuthor {
  id: string;
  content: string;
  applicantId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

const getComments = async (
  applicantId: string,
  limit: number,
  cursor?: string,
) => {
  const url = `/api/applicant/${applicantId}/comments?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
  const res = await agent.get<TInfinityResponse<CommentWithAuthor>>(url);

  if (!res.data) throw new NotFoundError('Comments not found');

  // Return only the data portion, not the entire response
  return res;
};

/**
 * Hook for fetching comments with infinite scrolling
 */
export const useInfiniteComments = (
  applicantId: string,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: [...QueryKeys.applicants.comments, { applicantId }],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getComments(applicantId, limit, pageParam),
    initialPageParam: undefined as undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    enabled: !!applicantId,
  });
};
