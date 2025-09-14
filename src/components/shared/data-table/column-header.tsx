'use client';

import type { Column } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations();

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-fit w-full items-center justify-center gap-1.5 rounded px-2 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
          className,
        )}
        {...props}
      >
        {title}
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuItem
              className="text-accent-foreground gap-1.5"
              disabled={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="size-5" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-accent-foreground gap-1.5"
              disabled={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="size-5" />
              Desc
            </DropdownMenuItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="text-accent-foreground gap-1.5"
                onClick={() => column.clearSorting()}
              >
                <X className="size-5" />
                {t('Common.reset')}
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuItem
            className="text-accent-foreground gap-1.5"
            disabled={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <span className="p-0.5">
              <EyeOff className="size-4.5" />
            </span>
            {t('Common.hide')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
