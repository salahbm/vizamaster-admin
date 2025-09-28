import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

interface ChatSkeletonProps {
  messageCount?: number;
}

export function ChatSkeleton({ messageCount = 3 }: ChatSkeletonProps) {
  return (
    <>
      {/* Date header skeleton */}
      <li
        className={cn(
          'flex justify-center py-2',
          messageCount === 1 && 'hidden',
        )}
      >
        <Skeleton className="h-5 w-32 rounded-full" />
      </li>

      {/* Generate multiple message skeletons */}
      {Array.from({ length: messageCount }).map((_, index) => {
        // Alternate between sent and received messages
        const isSent = index % 2 === 0;

        return (
          <li
            key={index}
            className={cn(
              `flex w-full py-2`,
              isSent ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                `flex max-w-[80%] flex-col gap-2`,
                isSent ? 'items-end' : 'items-start',
              )}
            >
              {/* Author and time */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>

              {/* Message content */}
              <div
                className={cn(
                  'w-full rounded-lg p-4 lg:min-w-[300px]',
                  isSent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/30',
                )}
              >
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  {index % 3 === 0 && <Skeleton className="h-4 w-[60%]" />}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}
