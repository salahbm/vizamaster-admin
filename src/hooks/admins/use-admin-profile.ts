import { useMutation, useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Users } from '@/generated/prisma';
import {
  TAdminPasswordDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import { TResponse } from '@/server/common/types';

// ───────────────── UPDATE ────────────────── //
export const updateAdminProfile = async (data: TAdminProfileDto) => {
  const response = await agent.put<TResponse<Users>>(
    'api/admins/profile',
    data,
  );
  if (!response.data) throw new Error('Failed to update profile');
  return response.data;
};

export const updateAdminPassword = async (data: TAdminPasswordDto) => {
  const response = await agent.put<TResponse<{ id: string }>>(
    'api/admins/password',
    data,
  );
  if (!response.data) throw new Error('Failed to update password');
  return response.data;
};

// ───────────────── HOOKS ────────────────── //

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.admin.profile,
      });
    },
  });
};

export const useUpdateAdminPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.admin.profile,
      });
    },
  });
};
