'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Input } from '@/components/ui/input';

import { GroupCodes } from '@/generated/prisma';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useCodes } from '@/hooks/settings/codes';

import { CODES_COLUMNS } from './codes-columns';

export const CodesTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => CODES_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState('search');

  const debouncedSearch = useDebounce(setSearch);

  const query = useQueryReader({
    sort: { type: 'object', defaultValue: [{ id: 'createdAt', desc: false }] },
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 10 },
    search: { type: 'string', defaultValue: '' },
    groupCodeId: { type: 'string', defaultValue: '' },
  });

  const { data, isLoading, isFetching } = useCodes({
    page: query.page,
    size: query.size,
    sort: query.sort,
    search: query.search,
    groupCodeId: query.groupCodeId,
  });

  const { table } = useDataTable({
    data: data?.data,
    columns: columns,
    pageCount: data?.meta?.totalPages ?? 0,
    getRowId: (originalRow: GroupCodes) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      columnPinning: {
        right: ['actions'],
      },
    },
    meta: { t },
  });

  if (isLoading) return <DataTableSkeleton columnCount={columns.length} />;

  return (
    <DataTable table={table} isLoading={isLoading || isFetching}>
      <Input
        value={search}
        type="search"
        placeholder={t('Common.search')}
        className="shrink-0 md:w-[30rem]"
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </DataTable>
  );
};
