import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { AdminsTable } from '@/components/views/admins';

import { AuthGuard } from '@/server/modules/auth/auth.guard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('admins');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function AdminsPage() {
  const authGuard = new AuthGuard();

  // Check if user is authenticated
  await authGuard.checkSession();

  const t = await getTranslations('admins');

  return (
    <div className="container mx-auto pb-6">
      <div className="mb-8">
        <h1 className="font-header mb-2">{t('metadata.title')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.description')}
        </p>
      </div>

      <AdminsTable />
    </div>
  );
}
