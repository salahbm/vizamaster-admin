'use client';

import { useState } from 'react';

import {
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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

import { DataTablePagination } from './pagination';
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

  return (
    <div>
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
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={trClassName}>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('Common.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={config} className={paginationClassName} />
    </div>
  );
}
