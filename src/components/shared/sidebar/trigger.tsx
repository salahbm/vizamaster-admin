'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useSidebar } from '@/store/sidebar';

import SidebarNav from './bar';

export default function Sidebar() {
  const { isMinimized, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'bg-background sticky top-0 flex h-[calc(100vh-4rem)] flex-col border-r transition-all duration-300',
        isMinimized ? 'w-0 lg:w-16' : 'w-64',
      )}
    >
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="shadow-1 border-border-200 bg-background absolute top-4 right-0 hidden w-5 translate-x-full cursor-pointer items-center justify-center rounded-r border border-l-0 py-4 lg:flex"
        onClick={toggle}
      >
        <ChevronRight
          className={cn('size-5', isMinimized ? 'rotate-0' : 'rotate-180')}
        />
      </button>

      {/* Navigation */}
      <SidebarNav />
    </aside>
  );
}
