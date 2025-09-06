'use client';

import { ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/sidebar';

import SidebarNav from './bar';

export default function Sidebar() {
  const { isMinimized, toggle } = useSidebar();
  const locale = useLocale();

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-background transition-all duration-300 relative',
        isMinimized ? 'lg:w-16 w-0 ' : 'w-64'
      )}
    >
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="shadow-1 hidden absolute right-0 top-5 lg:flex w-5 translate-x-full cursor-pointer items-center justify-center rounded-r border border-l-0 border-border-200 bg-background py-4"
        onClick={toggle}
      >
        <ChevronRight
          className={cn('size-5 text-border-200', isMinimized ? 'rotate-0' : 'rotate-180')}
        />
      </button>

      {/* Navigation */}
      <SidebarNav />
    </aside>
  );
}
