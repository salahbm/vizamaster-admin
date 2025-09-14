'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useChangeAdminRole, useToggleAdminStatus } from '@/hooks/admins';

import { Users } from '../../../../generated/prisma';

export const ADMIN_COLUMNS: ColumnDef<Users>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('admins.columns.name')
            : 'Name'
        }
      />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('admins.columns.email')
            : 'Email'
        }
      />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('admins.columns.role')
            : 'Role'
        }
      />
    ),
    cell: ({ row }) => <ChangeRole row={row} />,
  },
  {
    accessorKey: 'active',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('admins.columns.status')
            : 'Status'
        }
      />
    ),
    cell: ({ row }) => <ToggleStatus row={row} />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('admins.columns.createdAt')
            : 'Created At'
        }
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{format(date, 'PPP')}</div>;
    },
  },
];

const ChangeRole = ({ row }: { row: Row<Users> }) => {
  const t = useTranslations('admins');
  const changeRole = useChangeAdminRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex-center gap-0.5">
          <Button variant="ghost" size="md" className="!px-0 capitalize">
            {row.original.role.toLowerCase().replace('_', ' ')}
          </Button>
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('actions.changeRole')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => changeRole(row.original.id, 'USER')}
          disabled={row.getValue('role') === 'USER'}
        >
          {t('roles.user')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeRole(row.original.id, 'EDITOR')}
          disabled={row.getValue('role') === 'EDITOR'}
        >
          {t('roles.editor')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeRole(row.original.id, 'ADMIN')}
          disabled={row.getValue('role') === 'ADMIN'}
        >
          {t('roles.admin')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ToggleStatus = ({ row }: { row: Row<Users> }) => {
  const t = useTranslations('admins');
  const toggleStatus = useToggleAdminStatus();
  const isActive = row.original.active;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex-center gap-0.5">
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? t('status.active') : t('status.inactive')}
        </Badge>
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('actions.toggleStatus')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => toggleStatus(row.original.id, !isActive)}
          disabled={isActive}
        >
          {t('status.active')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleStatus(row.original.id, !isActive)}
          disabled={!isActive}
        >
          {t('status.inactive')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
