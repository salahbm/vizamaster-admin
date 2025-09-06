'use client';

import Image from 'next/image';

import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { IMAGES } from '@/constants/images';
import { Link } from '@/i18n/routing';
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
        <div className="flex items-center gap-4 md:gap-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggle()}
            className="lg:hidden"
            aria-label={t('toggleSidebar')}
          >
            <Menu className="size-5" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image src={IMAGES.logo} alt="Logo" width={60} height={60} />
            <h1 className="linear-gradient text-2xl font-bold">Viza Master</h1>
          </Link>
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
