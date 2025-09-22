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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CountryData {
  name: string;
  count: number;
  color?: string;
}

interface ICountryDistributionChartProps {}

const CountryDistributionChart: React.FC<
  ICountryDistributionChartProps
> = () => {
  const t = useTranslations();

  // Custom warm, soft colors for the chart
  const chartColors = [
    '#E57373', // soft red
    '#FFB74D', // soft orange
    '#FFF176', // soft yellow
    '#81C784', // soft green
    '#64B5F6', // soft blue
    '#9575CD', // soft purple
    '#F06292', // soft pink
    '#4DB6AC', // soft teal
    '#A1887F', // soft brown
    '#90A4AE', // soft blue-grey
  ];

  // Mock data - replace with real data later
  const data: CountryData[] = [
    { name: 'USA', count: 245 },
    { name: 'Canada', count: 187 },
    { name: 'UK', count: 156 },
    { name: 'Germany', count: 142 },
    { name: 'Australia', count: 128 },
    { name: 'France', count: 112 },
    { name: 'Japan', count: 98 },
    { name: 'Spain', count: 76 },
  ]
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }));

  const maxCount = Math.max(...data.map((item) => item.count));
  const yAxisTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round((maxCount / 4) * i),
  );

  return (
    <Card className="border-0 p-0 md:border md:p-0">
      <CardHeader className="px-2 pt-2 pb-0 md:px-6 md:pt-6 md:pb-2">
        <CardTitle className="text-base font-medium">
          {t('dashboard.charts.countries.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
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
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                ticks={yAxisTicks}
              />
              <Tooltip
                cursor={{ fill: 'rgb(244 245 247 / 0.5)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CountryData;
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
                            {data.count}{' '}
                            {t('dashboard.charts.countries.tooltip.applicants')}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryDistributionChart;
