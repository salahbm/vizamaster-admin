'use client';

import { Fragment, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import * as nuqs from 'nuqs';
import { useQueryState } from 'nuqs';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Applicant } from '@/generated/prisma';
import { useGetAllApplicants } from '@/hooks/applicant';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useDebounceValue } from '@/hooks/common/use-debounce-val';
import { useQueryReader } from '@/hooks/common/use-query-reader';

import { APPLICANT_COLUMNS } from './applicant-columns';

export const ApplicantTable = ({
  country,
  partner,
}: {
  country?: string;
  partner?: string;
}) => {
  const t = useTranslations();
  const [isArchived, setIsArchived] = useQueryState(
    'isArchived',
    nuqs.parseAsBoolean.withDefault(false),
  );
  const columns = useMemo(() => APPLICANT_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState(
    'search',
    nuqs.parseAsString.withDefault(''),
  );

  const debounced = useDebounceValue(search, 500);

  const query = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 50 },
    sort: { type: 'object', defaultValue: { id: 'createdAt', desc: true } },
    search: { type: 'string', defaultValue: '' },
    country: { type: 'string', defaultValue: country },
    partner: { type: 'string', defaultValue: partner },
    isArchived: { type: 'boolean', defaultValue: false },
  });

  const {
    data: applicants,
    isLoading,
    isFetching,
  } = useGetAllApplicants({
    page: query.page,
    size: query.size,
    sort: query.sort,
    search: debounced,
    country: query.country,
    partner: query.partner,
    isArchived: query.isArchived,
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
    meta: { t },
  });

  if (isLoading) return <DataTableSkeleton columnCount={columns.length} />;

  return (
    <Fragment>
      <Tabs
        defaultValue="false"
        className="mb-4 md:mb-6"
        value={isArchived.toString()}
        onValueChange={(value) => setIsArchived(value === 'true')}
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
      <DataTable table={table} isLoading={isLoading || isFetching}>
        <Input
          value={search}
          type="search"
          placeholder={t('Common.search')}
          className="shrink-0 md:w-[30rem]"
          onChange={(e) => setSearch(e.target.value)}
        />
      </DataTable>
    </Fragment>
  );
};
