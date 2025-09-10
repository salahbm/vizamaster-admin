'use client';

import { useSearchParams } from 'next/navigation';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTable } from '@/components/shared/data-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Loader from '@/components/ui/loader';

import { useDataTable } from '@/hooks/common/use-data-table';
import { useGetData } from '@/hooks/table';

import { statusOptions } from './columns';

// Generate all data (this would typically come from an API)

type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLogin: Date;
  loginCount: number;
};

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    meta: {
      label: 'ID',
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    meta: {
      label: 'Username',
    },
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    meta: {
      label: 'Full Name',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: {
      label: 'Email',
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    meta: {
      label: 'Role',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusOption = statusOptions.find(
        (option) => option.value === status,
      );

      return (
        <Badge
          variant="outline"
          className={`${statusOption?.color} border-0 text-white`}
        >
          {statusOption?.label || status}
        </Badge>
      );
    },
    meta: {
      label: 'Status',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return <div>{format(date, 'PPP')}</div>;
    },
    meta: {
      label: 'Created At',
    },
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('lastLogin') as Date;
      return <div>{format(date, 'PPP')}</div>;
    },
    meta: {
      label: 'Last Login',
    },
  },
  {
    accessorKey: 'loginCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Login Count" />
    ),
    meta: {
      label: 'Login Count',
    },
  },
];

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
    columns,
    pageCount: data?.paging.totalPages,
    initialState: {
      sorting: [{ id: 'id', desc: true }],
      columnPinning: { left: ['select'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    meta: {
      includePaginationReset: false,
    },
  });
  if (isLoading) return <Loader />;

  return <DataTable table={table} />;
}
