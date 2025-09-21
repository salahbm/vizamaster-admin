import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { UpsertApplicant } from '@/components/views/applicant';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; partner: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('applicant');

  const { country, partner } = await params;

  return {
    title: t('metadata.createTitle'),
    description: t('metadata.createDescription', { country, partner }),
  };
}

export default async function ApplicantCreatePage({
  params,
}: {
  params: Promise<{ country: string; partner: string }>;
}) {
  const { country, partner } = await params;
  const t = await getTranslations('applicant');

  return (
    <Fragment>
      <div className="mb-8 lg:ml-4">
        <h1 className="font-header mb-2">{t('metadata.createTitle')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.createDescription', { country, partner })}
        </p>
      </div>
      <UpsertApplicant countryOfEmployment={country} partner={partner} />
    </Fragment>
  );
}
