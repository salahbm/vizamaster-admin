'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/shared/data-table';
import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';

import { useDataTable } from '@/hooks/common/use-data-table';
import { useSidebar } from '@/hooks/settings/sidebar';

import { Sidebar } from '../../../../generated/prisma';
import { SIDEBAR_COLUMNS } from './columns';

export const SidebarTable = () => {
  const t = useTranslations();
  const columns = useMemo(() => SIDEBAR_COLUMNS, []);

  const { data, isLoading, isFetching } = useSidebar();

  // Ensure we're working with an array of Sidebar objects
  const sidebarItems = Array.isArray(data?.data) ? data?.data : [];

  const { table } = useDataTable({
    data: sidebarItems,
    columns: columns,
    pageCount: 0,
    getRowId: (originalRow: Sidebar) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    meta: { t },
  });

  if (isLoading) return <DataTableSkeleton columnCount={columns.length} />;

  return <DataTable table={table} isLoading={isLoading || isFetching} />;
};
