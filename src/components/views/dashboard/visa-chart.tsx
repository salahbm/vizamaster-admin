'use client';

import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Skeleton } from '@/components/ui/skeleton';

import { VisaData } from '@/utils/analytics';

interface IVisaStatusChartProps {
  data?: VisaData;
  isLoading?: boolean;
}

const VisaStatusChart: React.FC<IVisaStatusChartProps> = ({
  data,
  isLoading = false,
}) => {
  const t = useTranslations();

  if (isLoading) return <Skeleton className="h-[350px] w-full" />;

  const chartData = [
    {
      name: t('dashboard.charts.visa.statuses.stillWorking'),
      value: data?.stillWorking ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.8)',
      status: 'stillWorking',
    },
    {
      name: t('dashboard.charts.visa.statuses.returned'),
      value: data?.returned ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.5)',
      status: 'returned',
    },
    {
      name: t('dashboard.charts.visa.statuses.departed'),
      value: data?.departed ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.2)',
      status: 'departed',
    },
  ];

  return (
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip
            cursor={{ fill: 'rgb(244 245 247 / 0.5)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background rounded-lg border p-2 shadow-md">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ background: data.color }}
                        />
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {data.value}{' '}
                        {t('dashboard.charts.visa.tooltip.applicants')}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill="oklch(0.72 0.2 35.5)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisaStatusChart;
