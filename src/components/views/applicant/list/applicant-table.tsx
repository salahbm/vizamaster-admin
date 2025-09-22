'use client';

import { Fragment, useMemo } from 'react';

import { Archive, FolderOpenDot, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as nuqs from 'nuqs';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Applicant } from '@/generated/prisma';
import { useDeleteApplicant, useGetAllApplicants } from '@/hooks/applicant';
import {
  useArchiveApplicant,
  useUnarchiveApplicant,
} from '@/hooks/applicant/use-archive';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useAlert } from '@/providers/alert';

import { APPLICANT_COLUMNS } from './applicant-columns';
import ApplicantFilter, { TApplicantFilter } from './applicant-filter';

export const ApplicantTable = ({
  country,
  partner,
}: {
  country?: string;
  partner?: string;
}) => {
  const alert = useAlert();
  const t = useTranslations();
  const columns = useMemo(() => APPLICANT_COLUMNS(country), [country]);

  const { mutateAsync: deleteApplicants, isPending: isDeleting } =
    useDeleteApplicant();
  const { mutateAsync: archiveApplicants, isPending: isArchiving } =
    useArchiveApplicant();
  const { mutateAsync: unarchiveApplicants, isPending: isUnarchiving } =
    useUnarchiveApplicant();

  // Instant filters - these update immediately
  const instantQuery = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 50 },
    sort: { type: 'object', defaultValue: { id: 'createdAt', desc: true } },
  });

  const countryDefault = country === 'all' ? '' : country || '';
  const partnerDefault = partner === 'all' ? '' : partner || '';

  // Form filters - these update only on form submission
  const [tabParam, setTabParam] = useQueryState(
    'tab',
    nuqs.parseAsString.withDefault('false'),
  );
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
    isArchived: tabParam === 'true',
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
        value={tabParam}
        onValueChange={(value) => setTabParam(value)}
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
      <DataTable table={table} isLoading={isLoading || isFetching}>
        {table.getFilteredSelectedRowModel()?.rows?.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              type="button"
              size="sm"
              onClick={() =>
                alert({
                  title: t('Common.delete'),
                  description: t('Common.messages.deleteDescription'),
                  onConfirm: async () =>
                    deleteApplicants(
                      table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original.id),
                    ),
                  confirmText: t('Common.delete'),
                })
              }
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('Common.delete')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isArchiving || isUnarchiving}
              onClick={async () =>
                // if tab is true then unarchive else archive
                tabParam === 'true'
                  ? await unarchiveApplicants(
                      table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original.id),
                    )
                  : alert({
                      title: t('Common.archive'),
                      description: t('Common.messages.archiveDescription'),
                      onConfirm: async () =>
                        archiveApplicants(
                          table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original.id),
                        ),
                      confirmText: t('Common.archive'),
                    })
              }
            >
              {tabParam === 'true' ? (
                <FolderOpenDot className="mr-2 h-4 w-4" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              {tabParam === 'true'
                ? t('Common.unarchive')
                : t('Common.archive')}
            </Button>
          </div>
        )}
      </DataTable>
    </Fragment>
  );
};
