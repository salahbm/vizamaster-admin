'use client';

import { DataTable } from '@/components/shared/data-table';
import Loader from '@/components/ui/loader';

import { useDataTable } from '@/hooks/common/use-data-table';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useGetData } from '@/hooks/table';

import { columns } from './columns';

export function TasksTable() {
  // Use the improved query reader hook to get URL parameters
  const query = useQueryReader({
    page: { type: 'number', defaultValue: 1 },
    size: { type: 'number', defaultValue: 10 },
    sort: { type: 'object', defaultValue: [{ id: 'createdAt', desc: true }] },
    search: { type: 'string', defaultValue: '' },
  });

  // Use the data fetching hook with the parsed parameters
  const { data, isLoading } = useGetData(query.page, query.size, query.sort);

  const { table } = useDataTable({
    data: data?.data,
    columns: columns,
    pageCount: data?.paging.totalPages,
    initialState: {
      columnPinning: { left: ['select'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    meta: {
      includePaginationReset: true,
    },
  });

  if (isLoading) return <Loader />;

  return <DataTable table={table} />;
}
