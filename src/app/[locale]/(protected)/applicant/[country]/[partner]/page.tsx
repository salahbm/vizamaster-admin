import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import { Metadata, NextPage } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('applicant');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

interface IApplicantPageProps {
  params: Promise<{
    locale: string;
    country: string;
    partner: string;
  }>;
}

const ApplicantPage: NextPage<IApplicantPageProps> = async ({ params }) => {
  const { locale, country, partner } = await params;

  const t = await getTranslations('applicant');
  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="font-header mb-2">{t('metadata.title')}</h1>
        <p className="font-body-2 text-muted-foreground">
          {t('metadata.description')}
        </p>
        {locale}
        {country}
        {partner}
      </div>
    </Fragment>
  );
};

export default ApplicantPage;
