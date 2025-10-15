'use client';

import { BadgeCheck, UserCog, UserPlus, Users, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';

import { KPIData } from '@/utils/analytics';

interface IApplicantKPICardsProps {
  data?: KPIData;
  isLoading?: boolean;
}

const statusColors = {
  TOTAL: 'oklch(0.88 0.12 260)', // calm indigo-blue
  NEW: 'oklch(0.90 0.14 230)', // friendly sky blue
  IN_PROGRESS: 'oklch(0.88 0.14 95)', // bright soft yellow
  CONFIRMED_PROGRAM: 'oklch(0.85 0.15 145)', // natural green
  HIRED: 'oklch(0.80 0.14 150)', // confident soft teal-green
  HOTEL_REJECTED: 'oklch(0.80 0.14 25)', // muted coral-orange
  APPLICANT_REJECTED: 'oklch(0.76 0.16 20)', // deeper red for clarity
  FIRED: 'oklch(0.68 0.16 15)', // darker muted red
};

const ApplicantKPICards: React.FC<IApplicantKPICardsProps> = ({
  data,
  isLoading,
}) => {
  const t = useTranslations();

  const kpiData = [
    {
      id: 'total',
      value: data?.total ?? 0,
      icon: Users,
      color: statusColors.TOTAL,
    },
    {
      id: 'confirmed_program',
      value: data?.confirmedProgram ?? 0,
      icon: Users,
      color: statusColors.CONFIRMED_PROGRAM,
    },

    {
      id: 'new',
      value: data?.new ?? 0,
      icon: UserPlus,
      color: statusColors.NEW,
    },
    {
      id: 'in_progress',
      value: data?.inProgress ?? 0,
      icon: UserCog,
      color: statusColors.IN_PROGRESS,
    },
    {
      id: 'hired',
      value: data?.hired ?? 0,
      icon: BadgeCheck,
      color: statusColors.HIRED,
    },
    {
      id: 'rejected',
      value: data?.rejected ?? 0,
      icon: XCircle,
      color: statusColors.HOTEL_REJECTED,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="bg-popover h-[130px] w-full rounded-lg border p-4 shadow-lg"
            />
          ))
        : kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                className="bg-popover rounded-lg border p-4 shadow-lg"
                // style={{
                //   borderLeft: `4px solid ${kpi.color}`,
                //   borderRight: `0.5px solid ${kpi.color}`,
                //   borderTop: `0.5px solid ${kpi.color}`,
                //   borderBottom: `0.5px solid ${kpi.color}`,
                // }}
              >
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-muted-foreground h-4 w-4" />
                  </div>
                  <h3
                    className="text-muted-foreground text-sm font-medium"
                    // style={{ color: kpi.color }}
                  >
                    {t(`dashboard.kpi.${kpi.id}.title`)}
                  </h3>
                </div>
                <div className="pt-2">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </div>
                  <p className="text-card-foreground mt-2 text-xs">
                    {t(`dashboard.kpi.${kpi.id}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ApplicantKPICards;
