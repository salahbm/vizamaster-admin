'use client';

import { format, subMonths } from 'date-fns';
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

interface TrendData {
  date: string;
  count: number;
}

interface IApplicantTrendChartProps {}

const ApplicantTrendChart: React.FC<IApplicantTrendChartProps> = () => {
  const t = useTranslations();

  // Mock data - replace with real data later
  const generateMockData = () => {
    const data: TrendData[] = [];
    const today = new Date();

    // Generate last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      data.push({
        date: format(date, 'MMM yyyy'),
        count: Math.floor(Math.random() * 50) + 20, // Random between 20-70
      });
    }

    return data;
  };

  const data = generateMockData();

  return (
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: -30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />{' '}
              {/* cyan-400 */}
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
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
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
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
            stroke="oklch(0.80 0.13 220)"
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicantTrendChart;
