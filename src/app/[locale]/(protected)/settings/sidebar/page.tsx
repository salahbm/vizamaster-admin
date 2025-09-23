import { Fragment } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { Plus } from 'lucide-react';
import { Metadata } from 'next';

import { SidebarTable } from '@/components/views/sidebar';

import { routes } from '@/constants/routes';

import { AuthGuard } from '@/server/common/guard/auth.guard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sidebar');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function SidebarPage() {
  const authGuard = new AuthGuard();

  // Check if user is authenticated
  const session = await authGuard.checkSession();

  if (!session) return redirect(routes.signIn);

  const t = await getTranslations('sidebar');

  return (
    <Fragment>
      <div className="flex-between mb-8">
        <div>
          <h1 className="font-header mb-2">{t('metadata.title')}</h1>
          <p className="font-body-2 text-muted-foreground">
            {t('metadata.description')}
          </p>
        </div>
        <Link href={routes.sidebarUpsert} className="create-btn">
          <Plus className="size-6" />
          {t('form.create')}
        </Link>
      </div>

      <SidebarTable />
    </Fragment>
  );
}
