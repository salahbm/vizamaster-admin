'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface FormSkeletonProps {
  sections?: number;
  fieldsPerSection?: number;
  showActions?: boolean;
}

export const FormSkeleton = ({
  sections = 4,
  fieldsPerSection = 3,
  showActions = true,
}: FormSkeletonProps) => {
  const renderFields = (count: number) => {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-pulse space-y-8">
      {Array.from({ length: sections }).map((_, index) => (
        <div key={index}>
          <Skeleton className="mb-2 h-7 w-[200px]" /> {/* Section Title */}
          <Skeleton className="mb-6 h-4 w-[300px]" />
          {/* Section Description */}
          {renderFields(fieldsPerSection)}
          <Separator className="my-8" />
        </div>
      ))}

      {showActions && (
        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-[100px]" /> {/* Cancel button */}
          <Skeleton className="h-10 w-[100px]" /> {/* Submit button */}
        </div>
      )}
    </div>
  );
};
