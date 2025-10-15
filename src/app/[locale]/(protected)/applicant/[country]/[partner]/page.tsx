import { Fragment } from 'react';

import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import { capitalize } from 'lodash';
import { Plus } from 'lucide-react';
import { Metadata, NextPage } from 'next';

import { ApplicantTable } from '@/components/views/applicant';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; partner: string }>;
}): Promise<Metadata> {
  const t = await getTranslations('applicant');

  const { country, partner } = await params;

  return {
    title: t('metadata.title'),
    description: `${t('metadata.description')} ${country} & ${partner}`,
  };
}

interface IApplicantPageProps {
  params: Promise<{
    country: string;
    partner: string;
  }>;
}

const ApplicantPage: NextPage<IApplicantPageProps> = async ({ params }) => {
  const { country, partner } = await params;

  const t = await getTranslations();
  return (
    <Fragment>
      <div className="flex-between mb-8">
        <div className="lg:ml-4">
          <h1 className="font-header mb-2">{t('applicant.metadata.title')}</h1>
          <p className="font-body-2 text-muted-foreground">
            {t('applicant.metadata.description')}
            {country !== 'all' ? (
              <>
                <strong>{capitalize(country)}</strong> &{' '}
                <strong>{capitalize(partner)}</strong>
              </>
            ) : null}
          </p>
        </div>
        <Link
          href={`/applicant/${country}/${partner}/create`}
          className="create-btn"
        >
          <Plus className="size-6" />
          {t('Common.create')}
        </Link>
      </div>
      <ApplicantTable country={country} partner={partner} />
    </Fragment>
  );
};

export default ApplicantPage;
