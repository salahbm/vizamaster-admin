'use client';

import { Fragment } from 'react';

import { useRouter } from 'next/navigation';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Column, ColumnDef, Row, Table } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Archive,
  Dot,
  EllipsisVertical,
  FolderOpenDot,
  Pencil,
  Trash,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTableColumnHeader } from '@/components/shared/data-table/column-header';
import { Badge, getStatusVariant } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Alert, Applicant } from '@/generated/prisma';
import { useDeleteApplicant } from '@/hooks/applicant';
import {
  useArchiveApplicant,
  useUnarchiveApplicant,
} from '@/hooks/applicant/use-archive';
import { useAlert } from '@/providers/alert';
import { useAuthStore } from '@/store/use-auth-store';
import { useCodesStore } from '@/store/use-codes-store';

export const APPLICANT_COLUMNS = (
  country?: string,
  alerts?: Alert[],
): ColumnDef<Applicant>[] => {
  const columns: ColumnDef<Applicant>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <span className="flex-center w-full">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </span>
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
      accessorKey: 'userId',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('applicant.columns.userId')
              : 'User ID'
          }
        />
      ),
      cell: ({ row }) => (
        <p className="relative">
          <span>{row.original.userId}</span>
          {alerts?.some((alert) => alert.applicantId === row.original.id) && (
            <Dot className="absolute -top-2 -left-4 size-8 -translate-y-1.5 animate-pulse text-red-500" />
          )}
        </p>
      ),
      meta: {
        label: 'applicant.columns.userId',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'firstName',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('Common.name')
              : 'Name'
          }
        />
      ),
      cell: ({ row }) => (
        <p className="flex flex-col">
          <span>{row.original.firstName}</span>
          <span>{row.original.lastName}</span>
        </p>
      ),
      meta: {
        label: 'Common.name',
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('Common.contact')
              : 'Contact'
          }
        />
      ),
      cell: ({ row }) => (
        <p className="flex flex-col">
          <span>{row.original.phoneNumber}</span>
          <span>{row.original.email}</span>
        </p>
      ),
      meta: {
        label: 'Common.contact',
      },
      enableSorting: false,
    },

    {
      accessorKey: 'preferredJobTitle',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('applicant.columns.preferredJobTitle')
              : 'Preferred Job Title'
          }
        />
      ),
      cell: ({ row }) => <CellJobTitle row={row} />,
      meta: {
        label: 'applicant.columns.preferredJobTitle',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('Common.status')
              : 'Status'
          }
        />
      ),
      cell: ({ row }) => <CellStatus row={row} />,
      meta: {
        label: 'Common.status',
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
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? table.options.meta.t('Common.updatedAt')
              : 'Updated At'
          }
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return (
          <div>
            <p>{format(date, 'dd.MM.yyyy')}</p>
            <p className="font-caption-2">{row.original.updatedBy}</p>
          </div>
        );
      },
      meta: {
        label: 'Common.updatedAt',
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

  // Insert countryOfEmployment column after phoneNumber and before preferredJobTitle when country === 'all'
  if (country === 'all') {
    const countryColumn: ColumnDef<Applicant> = {
      accessorKey: 'countryOfEmployment',
      header: ({
        column,
        table,
      }: {
        column: Column<Applicant>;
        table: Table<Applicant>;
      }) => (
        <DataTableColumnHeader
          column={column}
          title={
            table.options?.meta?.t
              ? `${table.options.meta.t('Common.country')}/${table.options.meta.t('Common.partner')}`
              : 'Country of Employment'
          }
        />
      ),
      cell: ({ row }: { row: Row<Applicant> }) => (
        <CellCountryOfEmployment row={row} />
      ),
      meta: {
        label: 'Common.country',
      },
    };

    // Insert countryColumn after phoneNumber
    columns.splice(3 + 1, 0, countryColumn);
  }

  return columns;
};

const CellStatus = ({ row }: { row: Row<Applicant> }) => {
  const t = useTranslations('applicant');
  const status = row.getValue('status');

  return (
    <Badge variant={getStatusVariant(status as string)}>
      {t(`status.${(status as string).toLowerCase()}`, {
        defaultValue: status as string,
      })}
    </Badge>
  );
};

const CellJobTitle = ({ row }: { row: Row<Applicant> }) => {
  const { getLabel } = useCodesStore();

  return <span>{getLabel(row.original.preferredJobTitle as string)}</span>;
};

const CellCountryOfEmployment = ({ row }: { row: Row<Applicant> }) => {
  const { getLabel } = useCodesStore();
  return (
    <div className="flex flex-col capitalize">
      <span>{getLabel(row.original.countryOfEmployment as string)}</span>
      <span>{getLabel(row.original.partner as string)}</span>
    </div>
  );
};

const ActionsCell = ({ row }: { row: Row<Applicant> }) => {
  const alert = useAlert();
  const router = useRouter();
  const t = useTranslations();
  const { user } = useAuthStore();
  const { mutateAsync: deleteApplicants } = useDeleteApplicant();
  const { mutateAsync: archiveApplicants } = useArchiveApplicant();
  const { mutateAsync: unarchiveApplicants } = useUnarchiveApplicant();
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex-center w-full">
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('Common.actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex-between"
            onClick={() =>
              router.push(
                `/applicant/${row.original.countryOfEmployment}/${row.original.partner}/${row.original.id}`,
              )
            }
          >
            {t('Common.edit')}
            <Pencil className="size-4" />
          </DropdownMenuItem>
          {user?.role !== 'EDITOR' ? (
            <Fragment>
              <DropdownMenuItem
                onClick={async () =>
                  alert({
                    title: t('Common.delete'),
                    description: t('Common.messages.deleteDescription'),
                    onConfirm: async () =>
                      await deleteApplicants([row.original.id]),
                    confirmText: t('Common.delete'),
                  })
                }
                className="flex-between"
              >
                {t('Common.delete')}
                <Trash className="size-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () =>
                  row.original.isArchived
                    ? await unarchiveApplicants([row.original.id])
                    : alert({
                        title: t('Common.archive'),
                        description: t('Common.messages.archiveDescription'),
                        onConfirm: async () =>
                          await archiveApplicants([row.original.id]),
                        confirmText: t('Common.archive'),
                      })
                }
                className="flex-between"
              >
                {row.original.isArchived
                  ? t('Common.unarchive')
                  : t('Common.archive')}
                {row.original.isArchived ? (
                  <FolderOpenDot className="size-4" />
                ) : (
                  <Archive className="size-4" />
                )}
              </DropdownMenuItem>
            </Fragment>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};
