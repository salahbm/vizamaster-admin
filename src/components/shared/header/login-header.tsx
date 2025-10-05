'use client';

import Image from 'next/image';

import { BRAND } from '@/constants/brand';
import { IMAGES } from '@/constants/images';

import { Link } from '@/i18n/routing';

import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';

export default function HeaderLogin() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-1 md:gap-0 lg:gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src={IMAGES.logo}
              alt={`${BRAND.name} Logo`}
              width={60}
              height={60}
              priority
              className="size-12 lg:size-12"
            />
            <h1 className="linear-gradient text-md font-roboto font-bold lg:text-2xl">
              {BRAND.name}
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-1 lg:gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
