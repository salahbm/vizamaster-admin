'use client';

import { useTranslations } from 'next-intl';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { StatusData } from '@/utils/analytics';

import { useIsMobile } from '@/hooks/common/use-mobile';

interface ChartDataInput {
  [key: string]: string | number;
}

interface ChartStatusData extends ChartDataInput {
  id: string;
  name: string;
  value: number;
  color: string;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: ChartStatusData;
  }>;
};

type CustomLegendProps = {
  payload?: Array<{
    value: string;
    payload: ChartStatusData;
  }>;
};

interface IApplicantStatusChartProps {
  data?: StatusData[];
  isLoading?: boolean;
}

const ApplicantStatusChart: React.FC<IApplicantStatusChartProps> = ({
  data = [],
  isLoading,
}) => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  if (isLoading || !data)
    return (
      <div className="card-md h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { value: 30 },
                { value: 25 },
                { value: 20 },
                { value: 15 },
                { value: 10 },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
            >
              {[
                'oklch(0.56 0.25 296.2 / 0.1)',
                'oklch(0.56 0.25 296.2 / 0.08)',
                'oklch(0.56 0.25 296.2 / 0.06)',
                'oklch(0.56 0.25 296.2 / 0.04)',
                'oklch(0.56 0.25 296.2 / 0.02)',
              ].map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );

  // Use primary and secondary colors with shades
  const statusColors = {
    NEW: 'oklch(0.56 0.25 296.2)',
    IN_PROGRESS: 'oklch(0.56 0.25 296.2 / 0.8)',
    CONFIRMED_PROGRAM: 'oklch(0.56 0.25 296.2 / 0.6)',
    HIRED: 'oklch(0.56 0.25 296.2 / 0.4)',
    HOTEL_REJECTED: 'oklch(0.72 0.2 35.5)',
    APPLICANT_REJECTED: 'oklch(0.72 0.2 35.5 / 0.6)',
    FIRED: 'oklch(0.72 0.2 35.5 / 0.4)',
  };

  const chartData = (data || []).map((item) => ({
    ...item,
    name: t(`Common.statuses.${item.id.toUpperCase()}`),
    color: statusColors[item.id as keyof typeof statusColors],
  }));

  const calculateTotal = (data: Array<{ value: number }>) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const total = calculateTotal(chartData);

  return (
    <div className="card-md h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }: CustomTooltipProps) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background rounded-lg border p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ background: data.color }}
                        />
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <div className="text-right font-medium">
                        {((data.value / total) * 100).toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground col-span-2 text-xs">
                        {data.value}{' '}
                        {t('dashboard.charts.countries.tooltip.applicants')}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {isMobile ? null : (
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={(props: any) => <CustomLegend {...props} />}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  const total = payload.reduce(
    (sum, item) => sum + (item.payload.value as number),
    0,
  );

  return (
    <div className="flex flex-col gap-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: entry.payload.color }}
          />
          <span className="text-xs">{entry.payload.name}</span>
          <span className="text-muted-foreground text-xs">
            {((entry.payload.value / total) * 100).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default ApplicantStatusChart;
