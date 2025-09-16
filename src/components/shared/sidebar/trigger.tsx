'use client';

import { Fragment } from 'react';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useSidebar } from '@/store/sidebar';

import SidebarNav from './bar';

export default function Sidebar() {
  const { isMinimized, toggle } = useSidebar();

  return (
    <Fragment>
      {/* Overlay */}
      {!isMinimized && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={cn(
          'bg-background fixed top-16 left-0 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-r transition-all duration-300 md:relative md:top-0 md:z-auto',
          isMinimized && 'lg:w-16',
          isMinimized ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
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
    </Fragment>
  );
}
