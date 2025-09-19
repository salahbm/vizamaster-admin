'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { parseAsString as n, useQueryState } from 'nuqs';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Input } from '@/components/ui/input';

import { Users } from '@/generated/prisma';
import { useAdmins } from '@/hooks/admins';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useDebounceValue } from '@/hooks/common/use-debounce-val';
import { useQueryReader } from '@/hooks/common/use-query-reader';

import { ADMIN_COLUMNS } from './columns';

export const AdminsTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => ADMIN_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState('search', n.withDefault(''));

  const debounced = useDebounceValue(search, 500);

  const query = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 50 },
    sort: { type: 'object', defaultValue: [{ id: 'role', desc: true }] },
    search: { type: 'string', defaultValue: '' },
  });

  const {
    data: admins,
    isLoading,
    isFetching,
  } = useAdmins({
    page: query.page,
    size: query.size,
    sort: query.sort,
    search: debounced,
  });

  const { table } = useDataTable({
    data: admins?.data,
    columns: columns,
    pageCount: admins?.meta?.totalPages,
    getRowId: (originalRow: Users) => originalRow.id,
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
        onChange={(e) => setSearch(e.target.value)}
      />
    </DataTable>
  );
};
