'use client';

import { useSearchParams } from 'next/navigation';

import { DataTable } from '@/components/shared/data-table';
import Loader from '@/components/ui/loader';

import { useDataTable } from '@/hooks/common/use-data-table';
import { useGetData } from '@/hooks/table';

import { columns } from './columns';

export function TasksTable() {
  const params = useSearchParams();

  // Get pagination and sorting parameters from URL
  const page = parseInt(params.get('page') || '0');
  const size = parseInt(params.get('size') || '10');
  const sortParam = params.get('sort') || 'id,desc';

  // Use the data fetching hook
  const { data, isLoading } = useGetData(page, size, sortParam);

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
