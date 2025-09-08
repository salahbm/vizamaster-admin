'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTable } from '@/components/shared/data-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Define possible status values and their colors
const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-500' },
];

// Define possible roles
const roles = ['Admin', 'User', 'Editor', 'Viewer', 'Moderator'];

// Generate 100 rows of data
const data = Array.from({ length: 100 }, (_, i) => {
  // Generate random date within the last 2 years
  const randomDaysAgo = Math.floor(Math.random() * 730); // 2 years in days
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - randomDaysAgo);

  // Generate random date for last login (more recent than creation date)
  const daysAfterCreation = Math.floor(Math.random() * randomDaysAgo);
  const lastLogin = new Date(createdAt);
  lastLogin.setDate(lastLogin.getDate() + daysAfterCreation);

  // Random status
  const status =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];

  // Random role
  const role = roles[Math.floor(Math.random() * roles.length)];

  return {
    id: `USR${(i + 1).toString().padStart(3, '0')}`,
    username: `user${i + 1}`,
    fullName: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: role,
    status: status.value,
    createdAt: createdAt,
    lastLogin: lastLogin,
    loginCount: Math.floor(Math.random() * 100),
    isVerified: Math.random() > 0.3, // 70% are verified
  };
});

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
  isVerified: boolean;
};

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
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
        <Badge className={`${statusOption?.color} text-white`}>
          {statusOption?.label || status}
        </Badge>
      );
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
  },
  {
    accessorKey: 'loginCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Login Count" />
    ),
  },
  {
    accessorKey: 'isVerified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => {
      const isVerified = row.getValue('isVerified') as boolean;
      return (
        <div className="flex justify-center">
          {isVerified ? (
            <span className="h-2 w-2 rounded-full bg-green-500" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      );
    },
  },
];

export function TasksTable() {
  return (
    <>
      <DataTable data={data} columns={columns} />
    </>
  );
}
