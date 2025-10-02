import React from 'react';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { PaginationMeta } from '@/server/common/types';

interface ITableAuditProps {
  meta: PaginationMeta;
  className?: string;
  t: ReturnType<typeof useTranslations>;
}

const TableAudit: React.FC<ITableAuditProps> = (props) => {
  if (!props?.meta?.total)
    return <Skeleton className="card-md mb-8 h-11 lg:h-16" />;
  return (
    <div
      className={cn('mb-8 rounded-md border px-3 py-2 md:p-4', props.className)}
    >
      <dl className="flex items-center justify-normal gap-2">
        <dt className="text-muted-foreground font-body-2">
          {props.t('Common.total')}:
        </dt>
        <dd className="font-body-1 text-primary">{props.meta.total}</dd>
      </dl>
    </div>
  );
};

export { TableAudit };
