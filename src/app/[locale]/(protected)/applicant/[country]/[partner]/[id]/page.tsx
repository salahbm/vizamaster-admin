import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { UpsertApplicant } from '@/components/views/applicant';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('applicant');

  return {
    title: t('metadata.editTitle'),
    description: t('metadata.editDescription'),
  };
}

export default async function ApplicantEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('applicant');

  return (
    <Fragment>
      <div className="mb-8 lg:ml-4">
        <h1 className="font-header mb-2">{t('metadata.editTitle')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.editDescription')}
        </p>
      </div>
      <UpsertApplicant id={id} />
    </Fragment>
  );
}
