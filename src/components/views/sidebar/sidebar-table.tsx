'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';

import { Sidebar } from '@/generated/prisma';
import { useDataTable } from '@/hooks/common/use-data-table';
import { useQueryReader } from '@/hooks/common/use-query-reader';
import { useSidebarTable } from '@/hooks/settings/sidebar';

import { SIDEBAR_COLUMNS } from './sidebar-columns';

export const SidebarTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => SIDEBAR_COLUMNS, []);

  const query = useQueryReader({
    sort: { type: 'object', defaultValue: [{ id: 'order', desc: false }] },
  });

  const { data, isLoading, isFetching } = useSidebarTable({ sort: query.sort });

  const { table } = useDataTable({
    data: data,
    columns: columns,
    pageCount: 0,
    getRowId: (originalRow: Sidebar) => originalRow.id,
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

  return <DataTable table={table} isLoading={isLoading || isFetching} />;
};
