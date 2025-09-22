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

interface PartnerData {
  name: string;
  count: number;
}

interface IPartnerPerformanceChartProps {}

const PartnerPerformanceChart: React.FC<IPartnerPerformanceChartProps> = () => {
  const t = useTranslations();

  // Mock data - replace with real data later
  const data: PartnerData[] = [
    { name: 'Partner A', count: 120 },
    { name: 'Partner B', count: 98 },
    { name: 'Partner C', count: 86 },
    { name: 'Partner D', count: 75 },
    { name: 'Partner E', count: 65 },
    { name: 'Partner F', count: 54 },
    { name: 'Partner G', count: 42 },
    { name: 'Partner H', count: 36 },
  ].sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t('dashboard.charts.partners.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 40, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e5e7eb"
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                width={100}
              />
              <Tooltip
                cursor={{ fill: 'rgb(244 245 247 / 0.5)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PartnerData;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ background: 'var(--chart-2)' }}
                            />
                            <span className="font-medium">{data.name}</span>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {data.count}{' '}
                            {t('dashboard.charts.partners.tooltip.applicants')}
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
                className="fill-[var(--chart-5)]" // matches --primary, warm & bold
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerPerformanceChart;
