import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import UpsertApplicant from '@/components/views/applicant/create/upsert';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('applicant');

  return {
    title: t('metadata.createTitle'),
    description: t('metadata.createDescription'),
  };
}

export default async function ApplicantCreatePage() {
  const t = await getTranslations('applicant');

  return (
    <Fragment>
      <div className="mb-8 lg:ml-4">
        <h1 className="font-header mb-2">{t('metadata.createTitle')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.createDescription')}
        </p>
      </div>
      <UpsertApplicant />
    </Fragment>
  );
}
