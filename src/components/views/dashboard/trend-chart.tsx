'use client';

import { useTranslations } from 'next-intl';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TrendData } from '@/utils/analytics';

interface IApplicantTrendChartProps {
  data?: TrendData[];
  isLoading?: boolean;
}

const ApplicantTrendChart: React.FC<IApplicantTrendChartProps> = ({
  data,
  isLoading,
}) => {
  const t = useTranslations();
  if (isLoading || !data)
    return (
      <div className="card-md h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.56 0.25 296.2 / 0.1)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.56 0.25 296.2 / 0)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              tick={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={false}
              tickMargin={10}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.56 0.25 296.2 / 0.1)"
              fill="url(#skeletonGradient)"
              data={[
                { value: 30 },
                { value: 50 },
                { value: 35 },
                { value: 65 },
                { value: 45 },
                { value: 55 },
                { value: 40 },
              ]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );

  return (
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: -30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="oklch(0.56 0.25 296.2)"
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor="oklch(0.56 0.25 296.2)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
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
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TrendData;
                return (
                  <div className="bg-background rounded-lg border p-2 shadow-md">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary h-2 w-2 rounded-full" />
                        <span className="font-medium">{data.date}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {data.count}{' '}
                        {t('dashboard.charts.trend.tooltip.applications')}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="oklch(0.56 0.25 296.2)"
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicantTrendChart;
