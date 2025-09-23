'use client';

import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface VisaData {
  partner: string;
  stillWorking: number;
  returned: number;
  departed: number;
  total: number;
}

interface IVisaStatusChartProps {}

const VisaStatusChart: React.FC<IVisaStatusChartProps> = () => {
  const t = useTranslations();

  // Mock data - replace with real data later
  const data: VisaData[] = [
    {
      partner: 'Partner A',
      stillWorking: 65,
      returned: 25,
      departed: 30,
      total: 120,
    },
    {
      partner: 'Partner B',
      stillWorking: 45,
      returned: 28,
      departed: 25,
      total: 98,
    },
    {
      partner: 'Partner C',
      stillWorking: 38,
      returned: 22,
      departed: 26,
      total: 86,
    },
    {
      partner: 'Partner D',
      stillWorking: 35,
      returned: 20,
      departed: 20,
      total: 75,
    },
    {
      partner: 'Partner E',
      stillWorking: 30,
      returned: 15,
      departed: 20,
      total: 65,
    },
  ].sort((a, b) => b.total - a.total); // Sort by total count descending

  const statusColors = {
    stillWorking: 'oklch(0.82 0.14 150)', // softer fresh green (minty, calm positive)
    returned: 'oklch(0.75 0.12 250)', // softer lavender-blue (peaceful neutral)
    departed: 'oklch(0.78 0.15 40)', // warm pastel orange (gentle departure)
  };

  return (
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -30, bottom: -30 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="partner"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
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
                const data = payload[0].payload as VisaData;
                return (
                  <div className="bg-background rounded-lg border p-2 shadow-md">
                    <div className="grid gap-2">
                      <div className="font-medium">{data.partner}</div>
                      {payload.map((entry) => (
                        <div
                          key={entry.dataKey}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              background:
                                statusColors[
                                  entry.dataKey as keyof typeof statusColors
                                ],
                            }}
                          />
                          <span className="text-xs">
                            {t(
                              `dashboard.charts.visa.statuses.${entry.dataKey}`,
                            )}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {entry.value}{' '}
                            {t('dashboard.charts.visa.tooltip.applicants')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ bottom: -10, left: 0, right: 0 }}
            content={({ payload }) => (
              <div className="mt-8 flex justify-center gap-4">
                {payload?.map((entry) => (
                  <div key={entry.value} className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="text-xs">
                      {t(`dashboard.charts.visa.statuses.${entry.dataKey}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
          <Bar
            dataKey="stillWorking"
            stackId="status"
            fill={statusColors.stillWorking}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="returned"
            stackId="status"
            fill={statusColors.returned}
          />
          <Bar
            dataKey="departed"
            stackId="status"
            fill={statusColors.departed}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisaStatusChart;
