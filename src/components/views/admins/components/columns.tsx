'use client';

import { useState } from 'react';

import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EllipsisVertical, Settings, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Users } from '@/generated/prisma';
import {
  useChangeAdminRole,
  useDeleteAdmin,
  useToggleAdminStatus,
} from '@/hooks/admins';
import { useAlert } from '@/providers/alert';

import { ManageSidebars } from './manage-sidebars';

export const ADMIN_COLUMNS: ColumnDef<Users>[] = [
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
    meta: {
      label: 'admins.columns.name',
    },
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
    meta: {
      label: 'admins.columns.email',
    },
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
    meta: {
      label: 'admins.columns.role',
    },
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
    meta: {
      label: 'admins.columns.status',
    },
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
      return <div>{format(date, 'dd.MM.yyyy')}</div>;
    },
    meta: {
      label: 'admins.columns.createdAt',
    },
  },
  {
    id: 'actions',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('Common.actions')
            : 'Actions'
        }
      />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    meta: {
      label: 'Common.actions',
    },
  },
];

const ChangeRole = ({ row }: { row: Row<Users> }) => {
  const t = useTranslations('admins');
  const changeRole = useChangeAdminRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex-center w-full gap-0.5">
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
      <DropdownMenuTrigger className="flex-center w-full gap-0.5">
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? t('status.active') : t('status.inactive')}
        </Badge>
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('actions.toggleStatus')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => toggleStatus(row.original.id, true)}
          disabled={isActive}
        >
          {t('status.active')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleStatus(row.original.id, false)}
          disabled={!isActive}
        >
          {t('status.inactive')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ActionsCell = ({ row }: { row: Row<Users> }) => {
  const [isSidebarModal, setSidebarModal] = useState(false);

  const alert = useAlert();
  const t = useTranslations();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex-center w-full">
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('Common.actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSidebarModal(true)}
            className="flex-between"
          >
            {t('admins.actions.manageSidebars')}
            <Settings className="size-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () =>
              alert({
                title: t('Common.delete'),
                description: t('Common.messages.deleteDescription'),
                onConfirm: async () => await deleteAdmin(row.original.id),
                confirmText: t('Common.delete'),
              })
            }
            className="flex-between"
          >
            {t('Common.delete')}
            <Trash className="size-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isSidebarModal && (
        <ManageSidebars
          isOpen={isSidebarModal}
          onClose={() => setSidebarModal(false)}
          user={row.original}
        />
      )}
    </>
  );
};
