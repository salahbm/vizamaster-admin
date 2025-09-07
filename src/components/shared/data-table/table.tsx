'use client';

import { useCallback, useState } from 'react';

import {
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDownAZ, MoveDown, MoveUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

import { DataTableProps } from './types';

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  tbodyClassName,
  tableClassName,
  theadClassName,
  trHeaderClassName,
  tdClassName,
  trClassName,
  paginationClassName,
  selectable,
  enableMultiRowSelection,
  onClick,
  form,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Translations
  const t = useTranslations();

  /* *****************************************************************
   * TABLE CONFIGURATION
   * ***************************************************************** */
  const config = useReactTable({
    data,
    columns,

    // meta: { t, form },

    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,

    state: {
      // sorting,
      // pagination,
      rowSelection,
    },

    defaultColumn: {
      minSize: 75,
      maxSize: Number.MAX_SAFE_INTEGER,
      size: 200,
    },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'rtl',

    //   enableSorting: isSortingEnabled,
    renderFallbackValue: '-',

    //   onPaginationChange: (updater) => {
    //     const newVal =
    //       typeof updater === 'function' ? updater(pagination) : updater;

    //     // If the pageSize changes, reset the pageIndex to the first page (1)
    //     const pageIndex =
    //       newVal.pageSize !== pagination.pageSize ? 1 : newVal.pageIndex + 1;

    //     setPagination &&
    //       setPagination({
    //         pageIndex,
    //         pageSize: newVal.pageSize,
    //       });
    //   },
    //   onSortingChange,
    getCoreRowModel: getCoreRowModel(),

    enableRowSelection: selectable,
    enableMultiRowSelection,
    // getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
  });

  const renderSortingIcon = useCallback(
    (sortState: string | false) =>
      sortState === 'asc' ? (
        <MoveUp className="size-4.5 min-w-5 shrink-0 text-neutral-500" />
      ) : sortState === 'desc' ? (
        <MoveDown className="size-4.5 min-w-5 shrink-0 text-neutral-500" />
      ) : (
        <ArrowDownAZ className="size-5 shrink-0 text-neutral-400" />
      ),
    [],
  );

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <Table className={tableClassName}>
        <TableHeader>
          {config.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={trHeaderClassName}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      theadClassName,
                      header.column.getCanSort() && 'cursor-pointer',
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {!header.isPlaceholder && (
                      <div className="flex-center group flex gap-x-2">
                        {/* HEADER */}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {/* SORTING ICON */}
                        {header.column.getCanSort() &&
                          renderSortingIcon(header.column.getIsSorted())}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={tbodyClassName}>
          {config.getRowModel().rows?.length ? (
            config.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={trClassName}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={tdClassName}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={trClassName}>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('Common.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
