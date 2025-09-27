'use client';

import { useRouter } from 'next/navigation';

import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useLogout } from '@/hooks/auth/use-logout';
import { useAuthStore } from '@/store/use-auth-store';

const Avatar = () => {
  const router = useRouter();
  const t = useTranslations('Common');
  const { user } = useAuthStore();
  const { mutateAsync: logout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Avatar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="w-40">
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings/preferences')}>
          <button type="button">{t('profile')}</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await logout()}>
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Avatar;
