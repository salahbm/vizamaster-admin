import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { TResponse } from '@/server/common/types';

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
      const { data } = await agent.get<AlertsResponse>('/api/alerts');
      return data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook for marking a specific alert as read
 */
export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { data } = await agent.patch<TResponse<boolean>>(
        `/api/alerts/${alertId}`,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({
        queryKey: QueryKeys.alerts.unread,
      });
    },
  });
};

/**
 * Hook for marking all alerts as read
 */
export const useMarkAllAlertsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await agent.patch<TResponse<boolean>>('/api/alerts');
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({
        queryKey: QueryKeys.alerts.unread,
      });
    },
  });
};
