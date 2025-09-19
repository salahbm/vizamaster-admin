'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { parseAsString as n, useQueryState } from 'nuqs';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Input } from '@/components/ui/input';

import { GroupCodes } from '@/generated/prisma';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useDebounceValue } from '@/hooks/common/use-debounce-val';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useGroupCodes } from '@/hooks/settings/group-codes';

import { GROUP_CODES_COLUMNS } from './group-codes-columns';

export const GroupCodesTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => GROUP_CODES_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState('search', n.withDefault(''));

  const debounced = useDebounceValue(search, 500);

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
    search: debounced,
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
        type="search"
        value={search ?? ''}
        placeholder={t('Common.search')}
        className="shrink-0 md:w-[30rem]"
        onChange={(e) => setSearch(e.target.value)}
      />
    </DataTable>
  );
};
