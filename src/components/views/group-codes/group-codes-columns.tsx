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

import { GroupCodes } from '@/generated/prisma';
import { useDeleteGroupCodeById } from '@/hooks/settings/group-codes';
import { useAlert } from '@/providers/alert';

export const GROUP_CODES_COLUMNS: ColumnDef<GroupCodes>[] = [
  {
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t ? table.options.meta.t('Common.name') : 'Name'
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
      label: 'Common.name',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t ? table.options.meta.t('Common.code') : 'Code'
        }
      />
    ),
    meta: {
      label: 'Common.code',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={
          table.options?.meta?.t
            ? table.options.meta.t('Common.createdAt')
            : 'Created At'
        }
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{format(date, 'dd.MM.yyyy')}</div>;
    },
    meta: {
      label: 'Common.createdAt',
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
    cell: ({ row }) => <DeleteGroupCodeItem row={row} />,
    meta: {
      label: 'Common.actions',
    },
    enableSorting: false,
  },
];

const DeleteGroupCodeItem = ({ row }: { row: Row<GroupCodes> }) => {
  const alert = useAlert();
  const router = useRouter();
  const t = useTranslations();
  const { mutateAsync: deleteGroupCodeItem } = useDeleteGroupCodeById();
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
          onClick={() =>
            router.push(`/settings/group-codes/${row.original.id}`)
          }
        >
          {t('Common.edit')}
          <Edit className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () =>
            alert({
              title: t('Common.delete'),
              description: t('Common.messages.deleteDescription'),
              onConfirm: async () => await deleteGroupCodeItem(row.original.id),
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
