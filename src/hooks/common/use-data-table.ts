'use client';

import * as React from 'react';

import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type UseQueryStateOptions, parseAsInteger, useQueryState } from 'nuqs';

import { getSortingStateParser } from '@/lib/data-table-func';

import { ISort, UseDataTableProps } from '@/types/data-table';

const PAGE_KEY = 'page';
const SIZE_KEY = 'size';
const SORT_KEY = 'sort';
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    data = [],
    columns,
    pageCount = -1,
    initialState,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    limitUrlUpdates,
    clearOnDefault = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ],
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // PAGINATION
  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1),
  );
  const [perPage, setPerPage] = useQueryState(
    SIZE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 50),
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  // SORTING
  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[],
    );
  }, [columns]);

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ISort[]);
      } else {
        setSorting(updaterOrValue as ISort[]);
      }
    },
    [sorting, setSorting],
  );

  // TABLE
  const table = useReactTable({
    ...tableProps,
    data,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },

    enableRowSelection: true,
    enableColumnPinning: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return { table, shallow, debounceMs, throttleMs };
}
