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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CountryData {
  name: string;
  count: number;
}

interface ICountryDistributionChartProps {}

const CountryDistributionChart: React.FC<
  ICountryDistributionChartProps
> = () => {
  const t = useTranslations();

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
  ].sort((a, b) => b.count - a.count); // Sort by count descending

  const maxCount = Math.max(...data.map((item) => item.count));
  const yAxisTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round((maxCount / 4) * i),
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t('dashboard.charts.countries.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
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
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ background: 'var(--chart-3)' }}
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
              <Bar
                dataKey="count"
                className="fill-[oklch(0.56_0.25_296.2)]" // matches --secondary
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryDistributionChart;
