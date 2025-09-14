'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { DataTable } from '@/components/shared/data-table';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';

import { useAdmins } from '@/hooks/admins';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useQueryReader } from '@/hooks/common/use-query-reader';

import { Users } from '../../../../generated/prisma';
import { ADMIN_COLUMNS } from './columns';

export const AdminsTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => ADMIN_COLUMNS, []);

  // Use the improved query reader hook to get URL parameters
  const [search, setSearch] = useQueryState('search');

  const debouncedSearch = useDebounce(setSearch);

  const query = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 50 },
    sort: { type: 'object', defaultValue: [{ id: 'createdAt', desc: true }] },
    search: { type: 'string', defaultValue: '' },
  });

  const { data, isLoading, isFetching } = useAdmins({
    page: query.page,
    size: query.size,
    // sort: query.sort,
    search: query.search,
  });

  const { table } = useDataTable({
    data: data?.data as Users[],
    columns: columns,
    pageCount: data?.meta.totalPages,
    getRowId: (originalRow: Users) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    meta: { t },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <Input
        value={search}
        type="search"
        placeholder="Search..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      <DataTable table={table} isLoading={isLoading || isFetching} />
    </div>
  );
};
