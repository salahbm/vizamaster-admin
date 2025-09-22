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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: StatusData;
  }>;
};

type CustomLegendProps = {
  payload?: Array<{
    value: string;
    payload: StatusData;
  }>;
};

interface StatusData {
  [key: string]: string | number; // Index signature for ChartDataInput
  // Specific fields
  id: string;
  name: string;
  value: number;
  color: string;
}

interface IApplicantStatusChartProps {}

const ApplicantStatusChart: React.FC<IApplicantStatusChartProps> = () => {
  const t = useTranslations();

  const statusColors = {
    NEW: 'rgb(59 130 246)', // info blue
    IN_PROGRESS: 'rgb(234 179 8)', // warning yellow
    CONFIRMED_PROGRAM: 'rgb(34 197 94)', // success green
    HIRED: 'rgb(22 163 74)', // darker success
    HOTEL_REJECTED: 'rgb(239 68 68)', // destructive red
    APPLICANT_REJECTED: 'rgb(220 38 38)', // darker destructive
    FIRED: 'rgb(185 28 28)', // darkest destructive
  };

  // Mock data - replace with real data later
  const data: StatusData[] = [
    {
      id: 'NEW',
      name: t('Common.statuses.new'),
      value: 45,
      color: statusColors.NEW,
    },
    {
      id: 'IN_PROGRESS',
      name: t('Common.statuses.inProgress'),
      value: 145,
      color: '#eab308', // yellow-500
    },
    {
      id: 'CONFIRMED_PROGRAM',
      name: t('Common.statuses.confirmedProgram'),
      value: 65,
      color: '#22c55e', // green-500
    },
    {
      id: 'HIRED',
      name: t('Common.statuses.hired'),
      value: 89,
      color: '#10b981', // emerald-500
    },
    {
      id: 'HOTEL_REJECTED',
      name: t('Common.statuses.hotelRejected'),
      value: 34,
      color: statusColors.HOTEL_REJECTED,
    },
    {
      id: 'APPLICANT_REJECTED',
      name: t('Common.statuses.applicantRejected'),
      value: 32,
      color: statusColors.APPLICANT_REJECTED,
    },
    {
      id: 'FIRED',
      name: t('Common.statuses.fired'),
      value: 12,
      color: statusColors.FIRED,
    },
  ];

  const calculateTotal = (data: StatusData[]) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const total = calculateTotal(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {t('dashboard.charts.status.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }: CustomTooltipProps) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
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
                            {data.value} applicants
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={(props: any) => <CustomLegend {...props} />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  const total =
    payload?.reduce((sum, item) => sum + (item.payload.value as number), 0) ||
    0;
  if (!payload) return null;

  return (
    <div className="flex flex-col gap-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: entry.payload.color }}
          />
          <span className="text-xs">{entry.value}</span>
          <span className="text-muted-foreground text-xs">
            {(((entry.payload.value || 0) / total) * 100)?.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default ApplicantStatusChart;
