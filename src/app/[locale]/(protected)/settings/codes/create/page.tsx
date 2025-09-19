import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import UpsertCode from '@/components/views/codes/codes-upsert';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('codes');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function SidebarCreatePage() {
  const t = await getTranslations('codes');

  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="font-header mb-2">{t('metadata.title')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.description')}
        </p>
      </div>

      <UpsertCode />
    </Fragment>
  );
}
