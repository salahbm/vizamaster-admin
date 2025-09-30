'use client';

import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  if (isLoading || !data)
    return (
      <div className="card-md flex h-[350px] w-full items-end justify-evenly">
        <Skeleton className="h-28 w-24 rounded-t-lg" />
        <Skeleton className="h-40 w-24 rounded-t-lg" />
        <Skeleton className="h-32 w-24 rounded-t-lg" />
      </div>
    );

  const chartData = [
    {
      name: t('dashboard.charts.visa.statuses.stillWorking'),
      value: data?.stillWorking ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.9)',
      status: 'stillWorking',
    },
    {
      name: t('dashboard.charts.visa.statuses.returned'),
      value: data?.returned ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.7)',
      status: 'returned',
    },
    {
      name: t('dashboard.charts.visa.statuses.departed'),
      value: data?.departed ?? 0,
      color: 'oklch(0.72 0.2 35.5 / 0.5)',
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
            stroke="none"
            fill="currentColor"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisaStatusChart;
