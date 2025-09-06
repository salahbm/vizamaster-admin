'use client';

import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/sidebar';

import Avatar from './avatar';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  const t = useTranslations('Header');
  const { toggle, isMinimized } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggle()}
            className="lg:hidden"
            aria-label={t('toggleSidebar')}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            {/* Show logo in header when sidebar is minimized on desktop or on mobile */}
            <div
              className={cn(
                'rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold'
              )}
            >
              Vizamaster
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Avatar />
        </div>
      </div>
    </header>
  );
}
