import { ColumnDef, RowData } from '@tanstack/react-table';
import { UseFormReturn } from 'react-hook-form';

export interface DataTableProps<TData, TValue> {
  columns:
    | ColumnDef<TData, TValue>[]
    | Array<{ accessorKey: string; header: string; tooltip?: boolean }>;
  data: TData[];

  // classNames
  className?: string;
  tbodyClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  trHeaderClassName?: string;
  tdClassName?: string;
  trClassName?: string;
  paginationClassName?: string;

  // events
  selectable?: boolean;
  enableMultiRowSelection?: boolean;
  onClick?: (_data: TData) => void;

  // form control
  form?: UseFormReturn<TData>;
}

// Header Intl Cell
// Extend TableMeta to support `t` property
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    t?: (_key: string, _data?: TData) => string; // Now TData is being used
    form?: UseFormReturn<TData, unknown, undefined>;
  }
}

// Tooltip
// Extend ColumnDef to support `tooltip` property
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData> {
    tooltip?: boolean | TData;
    form?: UseFormReturn<TData, unknown, undefined>;
  }
}

// ****************************************************************

export type PaginationParams = { pageIndex: number; pageSize: number };

export type SortDirection = 'asc' | 'desc';
export type SortParams = { sort?: `${string}.${SortDirection}` };
