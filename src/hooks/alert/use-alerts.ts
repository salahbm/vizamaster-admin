import { useQuery, useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Alert } from '@/generated/prisma';
import { TResponse } from '@/server/common/types';

import useMutation from '../common/use-mutation';

/**
 * Hook for fetching unread alerts
 */
export const useUnreadAlerts = (userId?: string) => {
  return useQuery({
    queryKey: [...QueryKeys.alerts.unread, { userId }],
    queryFn: async (): Promise<Alert[]> => {
      const { data } = await agent.get<TResponse<Alert[]>>(
        `/api/alerts?userId=${userId}`,
      );

      if (!data) throw new Error('Alerts not found');

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
