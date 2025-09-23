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

import { useIsMobile } from '@/hooks/common/use-mobile';

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
  const isMobile = useIsMobile();

  const statusColors = {
    NEW: '#6BB8E5', // soft sky blue
    IN_PROGRESS: '#FFE066', // warm pastel yellow
    CONFIRMED_PROGRAM: '#7DDBA1', // minty soft green
    HIRED: '#4CAF7D', // muted medium green
    HOTEL_REJECTED: '#FF8A80', // soft coral red
    APPLICANT_REJECTED: '#FF6B6B', // warm strawberry red
    FIRED: '#D9534F', // softer brick red
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
      color: statusColors.IN_PROGRESS,
    },
    {
      id: 'CONFIRMED_PROGRAM',
      name: t('Common.statuses.confirmedProgram'),
      value: 65,
      color: statusColors.CONFIRMED_PROGRAM,
    },
    {
      id: 'HIRED',
      name: t('Common.statuses.hired'),
      value: 89,
      color: statusColors.HIRED,
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
    <div className="card-md ] h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={140}
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
                        {data.value} applicants
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
