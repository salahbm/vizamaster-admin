import React from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { PaginationMeta } from '@/server/common/types';

interface ITableAuditProps {
  meta: PaginationMeta;
  className?: string;
  t: ReturnType<typeof useTranslations>;
}

const TableAudit: React.FC<ITableAuditProps> = (props) => {
  return (
    <div className={cn('card-md mb-8', props.className)}>
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
