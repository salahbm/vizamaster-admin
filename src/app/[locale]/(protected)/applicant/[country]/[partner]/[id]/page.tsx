import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata } from 'next';

import { UpsertApplicant } from '@/components/views/applicant';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; country: string; partner: string }>;
}): Promise<Metadata> {
  const { country, partner } = await params;
  const t = await getTranslations('applicant');

  return {
    title: t('metadata.editTitle'),
    description: t('metadata.editDescription', {
      country,
      partner,
    }),
  };
}

export default async function ApplicantEditPage({
  params,
}: {
  params: Promise<{ id: string; country: string; partner: string }>;
}) {
  const { id, country, partner } = await params;
  const t = await getTranslations('applicant');

  return (
    <Fragment>
      <div className="mb-8 lg:ml-4">
        <h1 className="font-header mb-2">{t('metadata.editTitle')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.editDescription', {
            country,
            partner,
          })}
        </p>
      </div>
      <UpsertApplicant
        id={id}
        countryOfEmployment={country}
        partner={partner}
      />
    </Fragment>
  );
}
