import { useCallback } from 'react';

import { useUpdateAdmin } from './use-update';

// Hook for toggling admin active status
export const useToggleAdminStatus = () => {
  const updateAdmin = useUpdateAdmin();

  return useCallback(
    (id: string, newActiveState: boolean) => {
      return updateAdmin.mutate({
        id,
        data: { active: newActiveState },
      });
    },
    [updateAdmin],
  );
};
