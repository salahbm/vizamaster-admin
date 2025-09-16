import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import UpsertSidebar from '@/components/views/sidebar/upsert';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sidebar');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function SidebarUpsertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const t = await getTranslations('sidebar');

  return (
    <div className="main-container">
      <div className="mb-8">
        <h1 className="font-header mb-2">{t('metadata.title')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.description')}
        </p>
      </div>

      <UpsertSidebar id={id} />
    </div>
  );
}
