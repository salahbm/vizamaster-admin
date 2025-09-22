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

interface PartnerData {
  name: string;
  count: number;
  color?: string;
}

interface IPartnerPerformanceChartProps {}

const PartnerPerformanceChart: React.FC<IPartnerPerformanceChartProps> = () => {
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
  const data: PartnerData[] = [
    { name: 'Partner A', count: 120 },
    { name: 'Partner B', count: 98 },
    { name: 'Partner C', count: 86 },
    { name: 'Partner D', count: 75 },
    { name: 'Partner E', count: 65 },
    { name: 'Partner F', count: 54 },
    { name: 'Partner G', count: 42 },
    { name: 'Partner H', count: 36 },
  ]
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }));

  return (
    <Card className="border-0 p-0 md:border md:p-0">
      <CardHeader className="px-2 pt-2 pb-0 md:px-6 md:pt-6 md:pb-2">
        <CardTitle className="text-base font-medium">
          {t('dashboard.charts.partners.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
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
                            {t('dashboard.charts.partners.tooltip.applicants')}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
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

export default PartnerPerformanceChart;
