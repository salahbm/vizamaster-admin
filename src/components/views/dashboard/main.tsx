'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { DatePicker } from '@/components/shared/date-pickers';
import { Separator } from '@/components/ui/separator';

import {
  groupKPIData,
  groupStatusData,
  groupTrendData,
  groupVisaData,
} from '@/utils/analytics';
import { getLastSixMonths } from '@/utils/date';

import { useAnalytics } from '@/hooks/analytics';
import { useDebounceValue } from '@/hooks/common/use-debounce-val';

import ApplicantKPICards from './kpi-cards';
import ApplicantStatusChart from './status-chart';
import ApplicantTrendChart from './trend-chart';
import VisaStatusChart from './visa-chart';

const DashboardView: React.FC = () => {
  const t = useTranslations();
  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: getLastSixMonths(),
    to: new Date(),
  });

  const debouncedRange = useDebounceValue(range, 500);

  const { data, isLoading } = useAnalytics(debouncedRange);

  const { kpi, status, visa, trend } = useMemo(() => {
    if (!data)
      return {
        kpi: undefined,
        status: undefined,
        visa: undefined,
        trend: undefined,
      };
    return {
      kpi: groupKPIData(data),
      status: groupStatusData(data),
      visa: groupVisaData(data),
      trend: groupTrendData(data),
    };
  }, [data]);

  return (
    <div className="space-y-12 overflow-x-hidden pb-8 sm:space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="ml-2 text-left sm:ml-4">
          <h2 className="font-header text-2xl sm:text-3xl">
            {t('dashboard.meta.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground">
            {t('dashboard.meta.description')}
          </p>
        </div>
        <DatePicker
          className="w-fit items-center gap-2 self-center md:ml-auto"
          variant="range"
          value={range}
          onChange={(value) => setRange(value as { from: Date; to: Date })}
        />
      </div>
      <Separator />
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="font-title">{t('dashboard.kpi.title')}</h2>
          <p className="font-caption-2 text-muted-foreground">
            {t('dashboard.kpi.description')}
          </p>
        </div>
        <ApplicantKPICards data={kpi} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Status Distribution */}
          <div>
            <h2 className="font-title">{t('dashboard.charts.status.title')}</h2>
            <p className="font-caption-2 text-muted-foreground">
              {t('dashboard.charts.status.description')}
            </p>
          </div>
          <ApplicantStatusChart data={status} isLoading={isLoading} />
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Visa Status */}
          <div>
            <h2 className="font-title">{t('dashboard.charts.visa.title')}</h2>
            <p className="font-caption-2 text-muted-foreground">
              {t('dashboard.charts.visa.description')}
            </p>
          </div>
          <VisaStatusChart data={visa} isLoading={isLoading} />
        </div>
      </div>

      {/* Application Trends */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="font-title">{t('dashboard.charts.trend.title')}</h2>
          <p className="font-caption-2 text-muted-foreground">
            {t('dashboard.charts.trend.description')}
          </p>
        </div>
        <ApplicantTrendChart data={trend} isLoading={isLoading} />
      </div>

      {/* currently no need for this keep commented for future use */}
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">

        <div className="space-y-3 sm:space-y-4">
          <div>
            <h2 className="font-title">
              {t('dashboard.charts.countries.title')}
            </h2>
            <p className="font-caption-2 text-muted-foreground">
              {t('dashboard.charts.countries.description')}
            </p>
          </div>
          <CountryDistributionChart />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <h2 className="font-title">
              {t('dashboard.charts.partners.title')}
            </h2>
            <p className="font-caption-2 text-muted-foreground">
              {t('dashboard.charts.partners.description')}
            </p>
          </div>
          <PartnerPerformanceChart />
        </div>
      </div> */}
    </div>
  );
};

export { DashboardView };
