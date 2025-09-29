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

interface PartnerData {
  name: string;
  count: number;
  color?: string;
}

interface IPartnerPerformanceChartProps {}

const PartnerPerformanceChart: React.FC<IPartnerPerformanceChartProps> = () => {
  const t = useTranslations();

  // Use secondary color with different shades
  const chartColors = [
    'oklch(0.56 0.25 296.2)',
    'oklch(0.56 0.25 296.2 / 0.9)',
    'oklch(0.56 0.25 296.2 / 0.8)',
    'oklch(0.56 0.25 296.2 / 0.7)',
    'oklch(0.56 0.25 296.2 / 0.6)',
    'oklch(0.56 0.25 296.2 / 0.5)',
    'oklch(0.56 0.25 296.2 / 0.4)',
    'oklch(0.56 0.25 296.2 / 0.3)',
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
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
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
  );
};

export default PartnerPerformanceChart;
