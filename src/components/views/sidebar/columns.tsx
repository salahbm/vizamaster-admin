'use client';

import { useRouter } from 'next/navigation';

import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAlert } from '@/providers/alert';

import { Sidebar } from '../../../../generated/prisma';

export const SIDEBAR_COLUMNS: ColumnDef<Sidebar>[] = [
  {
    accessorKey: 'order',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('sidebar.columns.order')
            : 'Order'
        }
      />
    ),
    meta: {
      label: 'sidebar.columns.order',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('sidebar.columns.name')
            : 'Name'
        }
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1 text-center">
          <p>{row.original.labelEn}</p>
          <p>{row.original.labelRu}</p>
        </div>
      );
    },
    meta: {
      label: 'sidebar.columns.name',
    },
  },
  {
    accessorKey: 'href',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('sidebar.columns.href')
            : 'URL Path'
        }
      />
    ),
    meta: {
      label: 'sidebar.columns.href',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('sidebar.columns.createdAt')
            : 'Created At'
        }
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{format(date, 'PPP')}</div>;
    },
    meta: {
      label: 'sidebar.columns.createdAt',
    },
    enableSorting: false,
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
    cell: ({ row }) => <DeleteSidebarItem row={row} />,
    meta: {
      label: 'Common.actions',
    },
    enableSorting: false,
  },
];

const DeleteSidebarItem = ({ row }: { row: Row<Sidebar> }) => {
  const alert = useAlert();
  const router = useRouter();
  const t = useTranslations();
  // const { mutateAsync: deleteSidebarItem } = useDeleteSidebarItem();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex-center w-full">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('Common.actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex-between"
          onClick={() => router.push(`/settings/sidebar/${row.original.id}`)}
        >
          {t('Common.edit')}
          <Edit className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () =>
            alert({
              title: t('Common.delete'),
              description: t('Common.messages.deleteDescription'),
              // onConfirm: async () => await deleteSidebarItem(row.original.id),
              confirmText: t('Common.delete'),
            })
          }
          className="flex-between"
        >
          {t('Common.delete')}
          <Trash className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
