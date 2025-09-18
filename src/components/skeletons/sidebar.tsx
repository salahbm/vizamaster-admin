'use client';

import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { useSidebar } from '@/store/sidebar';

export const SideNavSkeleton: FC = () => {
  const { isMinimized } = useSidebar();

  return (
    <nav
      aria-label={'Loading Sidebar Navigation'}
      className={cn(
        'no-scrollbar mt-2 h-full flex-1 overflow-y-auto px-3 py-5 transition-all duration-300',
        isMinimized ? 'hidden w-0 lg:block lg:w-16' : 'w-64',
      )}
    >
      <div className="space-y-4">
        {/* Top level items */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            {/* Parent item */}
            <div className="flex items-center gap-2">
              <Skeleton className="size-8" />
              {!isMinimized && <Skeleton className="h-8 flex-1" />}
            </div>

            {/* Child items - show only if not minimized */}
            {!isMinimized && index % 2 === 0 && (
              <div className="space-y-2 pt-1 pl-6">
                {Array.from({ length: 3 }).map((_, childIndex) => (
                  <div
                    key={childIndex}
                    className="flex items-center gap-2 px-4"
                  >
                    <Skeleton className="size-8" />
                    <Skeleton className="h-8 max-w-28 flex-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
