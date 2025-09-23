'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface IApplicantKPICardsProps {}

const statusColors = {
  NEW: '#6BB8E5', // soft sky blue
  IN_PROGRESS: '#FFE066', // warm pastel yellow
  CONFIRMED_PROGRAM: '#7DDBA1', // minty soft green
  HIRED: '#4CAF7D', // muted medium green
  HOTEL_REJECTED: '#FF8A80', // soft coral red
  APPLICANT_REJECTED: '#FF6B6B', // warm strawberry red
  FIRED: '#D9534F', // softer brick red
};

const ApplicantKPICards: React.FC<IApplicantKPICardsProps> = () => {
  const t = useTranslations();

  // Temporary mock data
  const kpiData = [
    {
      id: 'total',
      value: 345,
      trend: '+12%',
      icon: Users,
      color: statusColors.CONFIRMED_PROGRAM,
    },
    {
      id: 'new',
      value: 45,
      trend: '+5%',
      icon: Users,
      color: statusColors.NEW,
    },
    {
      id: 'in_progress',
      value: 145,
      trend: '+8%',
      icon: Users,
      color: statusColors.IN_PROGRESS,
    },
    {
      id: 'hired',
      value: 89,
      trend: '+15%',
      icon: Users,
      color: statusColors.HIRED,
    },
    {
      id: 'rejected',
      value: 66,
      trend: '-2%',
      icon: Users,
      color: statusColors.HOTEL_REJECTED,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="rounded-lg p-4"
            style={{
              backgroundColor: `${kpi.color}15`,
              borderLeft: `4px solid ${kpi.color}`,
            }}
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {t(`dashboard.kpi.${kpi.id}.title`)}
              </h3>
              <Icon style={{ color: kpi.color }} className="h-4 w-4" />
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-muted-foreground text-xs">
                {t(`dashboard.kpi.${kpi.id}.description`)}
              </p>
              <div
                className={`mt-1 text-xs`}
                style={{
                  color: kpi.trend.startsWith('-')
                    ? statusColors.HOTEL_REJECTED
                    : statusColors.HIRED,
                }}
              >
                {kpi.trend} from last month
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicantKPICards;
