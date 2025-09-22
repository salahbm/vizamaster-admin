import React from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Skeleton } from '../ui/skeleton';

const FieldSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Skeleton
      className={cn(
        'flex h-11 w-full items-center justify-between rounded border px-3 py-2',
        className,
      )}
    >
      <div className="bg-muted h-4 w-20 rounded" />
      <ChevronDown className="text-muted-foreground size-4" />
    </Skeleton>
  );
};

export default FieldSkeleton;
