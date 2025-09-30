'use client';

import { Fragment, useMemo } from 'react';

import { Archive, FolderOpenDot, Loader2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as nuqs from 'nuqs';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';

import { DataTable, TableAudit } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { alertGrouper } from '@/utils/helpers';

import { Applicant } from '@/generated/prisma';
import { useUnreadAlerts } from '@/hooks/alert/use-alerts';
import { useDeleteApplicant, useGetAllApplicants } from '@/hooks/applicant';
import {
  useArchiveApplicant,
  useUnarchiveApplicant,
} from '@/hooks/applicant/use-archive';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useAlert } from '@/providers/alert';
import { useAuthStore } from '@/store/use-auth-store';

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
  const { user } = useAuthStore();

  const { data: unreadAlerts, refetch } = useUnreadAlerts(user?.id);

  const { mutateAsync: deleteApplicants, isPending: isDeleting } =
    useDeleteApplicant();
  const { mutateAsync: archiveApplicants, isPending: isArchiving } =
    useArchiveApplicant();
  const { mutateAsync: unarchiveApplicants, isPending: isUnArchiving } =
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
    nuqs.parseAsString.withDefault('active'),
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
  const [workplaceParam, setWorkplaceParam] = useQueryState(
    'workplace',
    nuqs.parseAsString.withDefault(''),
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
      workplace: workplaceParam,
      jobTitle: jobTitleParam,
    },
  });

  // ───────────────── COLUMNS ────────────────── //
  const columns = useMemo(
    () => APPLICANT_COLUMNS(country, unreadAlerts),
    [country, unreadAlerts],
  );

  // ───────────────── TABLE ────────────────── //
  const {
    data: applicants,
    isLoading,
    isFetching,
  } = useGetAllApplicants({
    // Instant filters
    userId: user?.id,
    page: instantQuery.page,
    size: instantQuery.size,
    sort: instantQuery.sort,
    isArchived:
      tabParam === 'archived'
        ? true
        : tabParam === 'active'
          ? false
          : undefined,
    isAlert: tabParam === 'alerts' ? true : undefined,
    // Form filters
    search: searchParam,
    country: countryParam,
    partner: partnerParam,
    status: statusParam,
    workplace: workplaceParam,
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

  // ───────────────── ALERT ────────────────── //
  const alertCount = useMemo(() => alertGrouper(unreadAlerts), [unreadAlerts]);

  // ───────────────── FORM ────────────────── //
  const onSubmit = async (data: TApplicantFilter) => {
    // Update URL params for form filters
    await Promise.all([
      setSearchParam(data.search || ''),
      setCountryParam(data.country || ''),
      setPartnerParam(data.partner || ''),
      setStatusParam(data.status || 'all'),
      setJobTitleParam(data.jobTitle || ''),
      setWorkplaceParam(data.workplace || ''),
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
      workplace: '',
    });

    table.resetRowSelection();
    table.resetSorting();

    // Reset URL params for form filters
    await Promise.all([
      setSearchParam(''),
      setCountryParam(''),
      setPartnerParam(''),
      setStatusParam('all'),
      setJobTitleParam(''),
      setWorkplaceParam(''),
    ]);
  };

  if (isLoading) return <DataTableSkeleton columnCount={columns.length} />;

  return (
    <Fragment>
      <Tabs
        defaultValue="active"
        className="mb-5 md:mb-10"
        value={tabParam}
        onValueChange={(value) => {
          refetch();
          setTabParam(value);
        }}
      >
        <TabsList variant="outline" className="justify-start">
          <TabsTrigger
            value="active"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.active')}
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            variant="outline"
            className="w-32 max-w-fit"
          >
            {t('Common.archived')}
          </TabsTrigger>
          <Tooltip delayDuration={300}>
            <TabsTrigger
              value="alerts"
              variant="outline"
              className="relative w-32 max-w-fit"
              asChild
            >
              <TooltipTrigger>
                {t('Common.alerts')}
                {isLoading ||
                  (alertCount.totalComments > 0 && (
                    <span className="bg-primary flex-center absolute top-0 right-2 aspect-square size-4 -translate-y-1.5 rounded-full p-0.5 text-xs text-white">
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        alertCount.totalComments
                      )}
                    </span>
                  ))}
              </TooltipTrigger>
            </TabsTrigger>
            <TooltipContent>
              <p className="font-body-2 flex items-center justify-normal gap-2">
                {alertCount.totalComments > 0 && (
                  <span>
                    {t('Common.messages.totalComments', {
                      comments: alertCount.totalComments,
                    })}
                  </span>
                )}
                {alertCount.totalApplicants > 0 && (
                  <span>
                    {t('Common.messages.totalApplicants', {
                      totalApplicants: alertCount.totalApplicants,
                    })}
                  </span>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
      </Tabs>
      <ApplicantFilter
        form={form}
        onSubmit={onSubmit}
        handleReset={handleReset}
        country={country}
      />
      <TableAudit t={t} meta={applicants?.meta!} />
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
              disabled={isArchiving || isUnArchiving}
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
