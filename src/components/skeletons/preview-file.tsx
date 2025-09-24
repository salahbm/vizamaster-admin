'use client';

import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

export const PreviewFileSkeleton = ({
  className,
  previewUrl,
}: {
  className?: string;
  previewUrl?: string;
}) => {
  return (
    <div className="bg-background flex shrink items-center justify-between gap-2 rounded-lg border p-2 pe-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="aspect-square shrink-0 rounded">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className={cn(
                'size-10 animate-pulse rounded-[inherit] object-cover grayscale-75',
                className,
              )}
            />
          ) : (
            <Skeleton className={cn('size-10 rounded-[inherit]', className)} />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="flex-center gap-2">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
};
