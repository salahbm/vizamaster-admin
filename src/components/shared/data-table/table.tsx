'use client';

import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { DataTableSkeleton } from '@/components/skeletons/data-table-skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCommonPinningStyles } from '@/lib/data-table-func';
import { cn } from '@/lib/utils';

import { downloadCsv } from '@/utils/helpers';

import { useGetCsv } from '@/hooks/csv';
import { DataTableProps } from '@/types/data-table';

import { Excel } from '../icons';
import Pagination from './pagination';
import { DataTableResetSortings } from './reset-sortings';
import { DataTableViewOptions } from './view-options';

export function DataTable<TData>({
  table,
  isLoading,
  className,
  tbodyClassName,
  tableClassName,
  theadClassName,
  trHeaderClassName,
  tdClassName,
  trClassName,
  paginationClassName,
  children,
}: DataTableProps<TData>) {
  const t = useTranslations();

  const { mutateAsync: download, isPending } = useGetCsv();

  if (isLoading)
    return (
      <DataTableSkeleton
        columnCount={table.getAllColumns().length}
        rowCount={Math.max(table.getRowModel().rows.length, 5)}
      />
    );

  return (
    <div>
      <div
        className={cn(
          'mb-2 flex w-full flex-col-reverse items-center gap-2 md:flex-row',
          children ? 'md:justify-between' : 'justify-end',
        )}
      >
        {children}
        <div className="flex w-full items-center gap-2">
          {table.options.meta?.includeDownload && (
            <Button
              aria-label="Download CSV"
              role="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={async () =>
                await download(undefined).then((res) =>
                  downloadCsv((res as { data: string })?.data),
                )
              }
            >
              <Excel className="size-4" />
              {t('Common.download')}
            </Button>
          )}
          <DataTableViewOptions table={table} />
          {table.options.meta?.includeResetSortings && (
            <DataTableResetSortings
              table={table}
              includePagination={table.options.meta?.includePaginationReset}
            />
          )}
        </div>
      </div>
      <div className={cn('overflow-hidden rounded-md border', className)}>
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={trHeaderClassName}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        theadClassName,
                        header.column.getCanSort() && 'cursor-pointer',
                      )}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={trClassName}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={tdClassName}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
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
                  colSpan={table.getAllColumns().length}
                  className="h-48 text-center"
                >
                  {t('Common.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} className={paginationClassName} />
    </div>
  );
}
