import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

import { cn } from '@/lib/utils';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      if (pageIndex > 2) {
        pages.push(0, 1, '...');
      }
      const start = Math.max(2, pageIndex - 1);
      const end = Math.min(pageCount - 3, pageIndex + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (pageIndex < pageCount - 3) {
        pages.push('...', pageCount - 2, pageCount - 1);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'mt-5 flex w-full items-center justify-between gap-4 overflow-auto',
        className,
      )}
      {...props}
    >
      {/* Page size */}

      <Combobox
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => table.setPageSize(Number(value))}
        options={pageSizeOptions.map((option) => ({
          value: option.toString(),
          label: option.toString(),
        }))}
        placeholder={table.getState().pagination.pageSize?.toString()}
        className="flex-center w-fit gap-2 px-2 py-1"
      />

      {/* <div className="text-muted-foreground text-sm whitespace-nowrap">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}

      <div className="flex items-center gap-4">
        {/* Pagination Numbers */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          {getPages().map((p, i) =>
            p === '...' ? (
              <span key={i} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={pageIndex === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => table.setPageIndex(p as number)}
              >
                {(p as number) + 1}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
