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
import { useGroupCodes } from '@/hooks/settings/group-codes';

import { GROUP_CODES_COLUMNS } from './group-codes-columns';

export const GroupCodesTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => GROUP_CODES_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState('search');

  const debouncedSearch = useDebounce(setSearch);

  const query = useQueryReader({
    sort: { type: 'object', defaultValue: [{ id: 'createdAt', desc: false }] },
    page: { type: 'number', defaultValue: 1 },
    limit: { type: 'number', defaultValue: 10 },
    search: { type: 'string', defaultValue: '' },
  });

  const { data, isLoading, isFetching } = useGroupCodes({
    page: query.page,
    size: query.limit,
    sort: query.sort,
    search: query.search,
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
    <div className="space-y-4">
      <Input
        value={search}
        type="search"
        placeholder={t('Common.search')}
        className="md:w-96"
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      <DataTable table={table} isLoading={isLoading || isFetching} />
    </div>
  );
};
