import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export const SideNavSkeleton: FC = () => {
  return (
    <div className="remove-scrollbar mt-7 flex h-full w-full flex-col gap-2 overflow-auto whitespace-nowrap pb-14">
      {Array.from({ length: 15 }).map((_, index) => (
        <Skeleton key={index} className="h-13 w-full rounded-md bg-gray-1" />
      ))}
    </div>
  );
};
