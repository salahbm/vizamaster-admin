import { format } from 'date-fns';

import { TAnalyticsData } from '@/hooks/analytics/use-analytics';

export interface KPIData {
  total: number;
  new: number;
  inProgress: number;
  hired: number;
  rejected: number;
}

export interface StatusData {
  id: string;
  name: string;
  value: number;
}

export interface VisaData {
  stillWorking: number;
  returned: number;
  departed: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export const groupKPIData = (data: TAnalyticsData[]): KPIData => {
  const counts = data.reduce(
    (acc, curr) => {
      acc.total++;
      switch (curr.status) {
        case 'NEW':
          acc.new++;
          break;
        case 'IN_PROGRESS':
          acc.inProgress++;
          break;
        case 'HIRED':
          acc.hired++;
          break;
        case 'HOTEL_REJECTED':
        case 'APPLICANT_REJECTED':
          acc.rejected++;
          break;
      }
      return acc;
    },
    { total: 0, new: 0, inProgress: 0, hired: 0, rejected: 0 },
  );

  return counts;
};

export const groupStatusData = (data: TAnalyticsData[]): StatusData[] => {
  const counts = data.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(counts).map(([status, count]) => ({
    id: status,
    name: status,
    value: count,
  }));
};

export const groupVisaData = (data: TAnalyticsData[]): VisaData => {
  return data.reduce(
    (acc, curr) => {
      if (curr.visa.length > 0) {
        const lastVisa = curr.visa[curr.visa.length - 1];
        switch (lastVisa.status) {
          case 'STILL_WORKING':
            acc.stillWorking++;
            break;
          case 'RETURNED':
            acc.returned++;
            break;
          case 'DEPARTED':
            acc.departed++;
            break;
        }
      }
      return acc;
    },
    { stillWorking: 0, returned: 0, departed: 0 },
  );
};

export const groupTrendData = (data: TAnalyticsData[]): TrendData[] => {
  const countsByMonth = data.reduce(
    (acc, curr) => {
      const monthKey = format(new Date(curr.createdAt), 'MMM yyyy');
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(countsByMonth).map(([date, count]) => ({
    date,
    count,
  }));
};
