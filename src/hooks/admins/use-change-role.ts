import { useCallback } from 'react';

import { UserRole } from '../../../generated/prisma';
import { useUpdateAdmin } from './use-update';

// Hook for changing admin role
export const useChangeAdminRole = () => {
  const updateAdmin = useUpdateAdmin();

  return useCallback(
    (id: string, role: UserRole) => {
      return updateAdmin.mutate({
        id,
        data: { role },
      });
    },
    [updateAdmin],
  );
};
