'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IApplicantKPICardsProps {}

const ApplicantKPICards: React.FC<IApplicantKPICardsProps> = () => {
  const t = useTranslations();

  // Temporary mock data
  const kpiData = [
    {
      id: 'total',
      value: 345,
      trend: '+12%',
      icon: Users,
      colorClass: 'text-primary',
    },
    {
      id: 'new',
      value: 45,
      trend: '+5%',
      icon: Users,
      colorClass: 'text-blue-500',
    },
    {
      id: 'in_progress',
      value: 145,
      trend: '+8%',
      icon: Users,
      colorClass: 'text-yellow-500',
    },
    {
      id: 'hired',
      value: 89,
      trend: '+15%',
      icon: Users,
      colorClass: 'text-green-500',
    },
    {
      id: 'rejected',
      value: 66,
      trend: '-2%',
      icon: Users,
      colorClass: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(`dashboard.kpi.${kpi.id}.title`)}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-muted-foreground text-xs">
                {t(`dashboard.kpi.${kpi.id}.description`)}
              </p>
              <div
                className={`mt-1 text-xs ${kpi.trend.startsWith('-') ? 'text-destructive' : 'text-green-500'}`}
              >
                {kpi.trend} from last month
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ApplicantKPICards;
