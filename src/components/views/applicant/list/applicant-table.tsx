'use client';

import { Fragment, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import * as nuqs from 'nuqs';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Applicant } from '@/generated/prisma';
import { useGetAllApplicants } from '@/hooks/applicant';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useQueryReader } from '@/hooks/common/use-query-reader';

import { APPLICANT_COLUMNS } from './applicant-columns';
import ApplicantFilter, { TApplicantFilter } from './applicant-filter';

export const ApplicantTable = ({
  country,
  partner,
}: {
  country?: string;
  partner?: string;
}) => {
  const t = useTranslations();
  // Using instantQuery.isArchived directly since it's an instant filter
  const columns = useMemo(() => APPLICANT_COLUMNS(country), [country]);

  // Instant filters - these update immediately
  const instantQuery = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 50 },
    sort: { type: 'object', defaultValue: { id: 'createdAt', desc: true } },
    isArchived: { type: 'boolean', defaultValue: false },
  });

  const countryDefault = country === 'all' ? '' : country || '';
  const partnerDefault = partner === 'all' ? '' : partner || '';

  // Form filters - these update only on form submission
  const [searchParam, setSearchParam] = useQueryState(
    'search',
    nuqs.parseAsString.withDefault(''),
  );
  const [countryParam, setCountryParam] = useQueryState(
    'country',
    nuqs.parseAsString.withDefault(countryDefault),
  );
  const [partnerParam, setPartnerParam] = useQueryState(
    'partner',
    nuqs.parseAsString.withDefault(partnerDefault),
  );
  const [statusParam, setStatusParam] = useQueryState(
    'status',
    nuqs.parseAsString.withDefault('all'),
  );
  const [jobTitleParam, setJobTitleParam] = useQueryState(
    'jobTitle',
    nuqs.parseAsString.withDefault(''),
  );

  const form = useForm<TApplicantFilter>({
    defaultValues: {
      search: searchParam,
      country: countryParam,
      partner: partnerParam,
      status: statusParam,
      jobTitle: jobTitleParam,
    },
  });

  const {
    data: applicants,
    isLoading,
    isFetching,
  } = useGetAllApplicants({
    // Instant filters
    page: instantQuery.page,
    size: instantQuery.size,
    sort: instantQuery.sort,
    isArchived: instantQuery.isArchived,
    // Form filters
    search: searchParam,
    country: countryParam,
    partner: partnerParam,
    status: statusParam,
    jobTitle: jobTitleParam,
  });

  const { table } = useDataTable({
    data: applicants?.data,
    columns: columns,
    pageCount: applicants?.meta?.totalPages,
    getRowId: (originalRow: Applicant) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      columnPinning: {
        left: ['select'],
        right: ['actions'],
      },
    },
    meta: { t, includeResetSortings: false, includeDownload: true },
  });

  const onSubmit = async (data: TApplicantFilter) => {
    // Update URL params for form filters
    await Promise.all([
      setSearchParam(data.search || ''),
      setCountryParam(data.country || ''),
      setPartnerParam(data.partner || ''),
      setStatusParam(data.status || 'all'),
      setJobTitleParam(data.jobTitle || ''),
    ]);
  };

  const handleReset = async () => {
    // Reset form values
    form.reset({
      search: '',
      country: '',
      partner: '',
      status: 'all',
      jobTitle: '',
    });

    // Reset URL params for form filters
    await Promise.all([
      setSearchParam(''),
      setCountryParam(''),
      setPartnerParam(''),
      setStatusParam('all'),
      setJobTitleParam(''),
    ]);
  };

  if (isLoading) return <DataTableSkeleton columnCount={columns.length} />;

  return (
    <Fragment>
      <Tabs
        defaultValue="false"
        className="mb-5 md:mb-10"
        value={instantQuery.isArchived.toString()}
        onValueChange={(value) => {
          // Update isArchived and reset page to 1
          const params = new URLSearchParams(window.location.search);
          params.set('isArchived', value);
          params.set('page', '1'); // Reset to page 1 when changing archive status
          window.history.pushState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`,
          );
          window.dispatchEvent(new Event('popstate')); // Trigger URL change detection
        }}
      >
        <TabsList variant="outline" className="justify-start">
          <TabsTrigger
            value="false"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.active')}
          </TabsTrigger>
          <TabsTrigger
            value="true"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.archived')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <ApplicantFilter
        form={form}
        onSubmit={onSubmit}
        handleReset={handleReset}
        country={country}
      />
      <DataTable table={table} isLoading={isLoading || isFetching} />
    </Fragment>
  );
};
