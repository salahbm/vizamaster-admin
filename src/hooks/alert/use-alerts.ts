import { useQuery, useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { TResponse } from '@/server/common/types';

import useMutation from '../common/use-mutation';

// Type for alert with nested comment and applicant
interface AlertWithDetails {
  id: string;
  commentId: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  comment: {
    id: string;
    content: string;
    applicantId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      name: string;
    };
    applicant: {
      id: string;
      firstName: string;
      lastName: string;
      countryOfEmployment: string;
      partner: string;
    };
  };
}

// Response type for alerts
interface AlertsResponse {
  data: AlertWithDetails[];
  statusCode: number;
  message: string;
}

/**
 * Hook for fetching unread alerts
 */
export const useUnreadAlerts = (userId?: string) => {
  return useQuery({
    queryKey: [...QueryKeys.alerts.unread, { userId }],
    queryFn: async () => {
      const { data } = await agent.get<AlertsResponse>(
        `/api/alerts?userId=${userId}`,
      );
      return data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook for marking all alerts as read
 */
export const useMarkAllAlertsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicantId,
      userId,
    }: {
      applicantId: string;
      userId: string;
    }) =>
      await agent.patch<TResponse<boolean>>(
        `/api/alerts?applicantId=${applicantId}&userId=${userId}`,
      ),
    options: {
      onSuccess: () => {
        // Invalidate and refetch alerts
        queryClient.invalidateQueries({
          queryKey: QueryKeys.alerts.unread,
          type: 'all',
        });
      },
      meta: {
        toast: false,
      },
    },
  });
};
