import { useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { NotFoundError } from '@/server/common/errors';
import { TResponse } from '@/server/common/types';

export type TAnalyticsData = {
  id: string;
  status: string;
  createdAt: Date;
  countryOfEmployment: string;
  partner: string;
  visa: {
    status: string;
    issueDate: Date;
    departureDate: Date;
    returnedDate: Date;
  }[];
};

export const useAnalytics = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: [...QueryKeys.analytics.all, { from, to }],
    queryFn: async (): Promise<TAnalyticsData[]> => {
      const { data } = await agent.get<TResponse<TAnalyticsData[]>>(
        `/api/analytics?from=${from}&to=${to}`,
      );
      if (!data) throw new NotFoundError();
      return data;
    },
  });

/**
  [
    {
        "id": "cmg0arcee0000k104d9ied0ea",
        "status": "CONFIRMED_PROGRAM",
        "createdAt": "2025-09-26T03:43:19.430Z",
        "countryOfEmployment": "bulgaria",
        "partner": "nomad",
        "visa": [
            {
                "status": "RETURNED",
                "issueDate": "2025-09-03T15:00:00.000Z",
                "departureDate": "2025-09-01T15:00:00.000Z",
                "returnedDate": "2025-09-04T15:00:00.000Z"
            }
        ]
    },
    {
        "id": "cmg3fwrjp0000jo04yjc3t4dr",
        "status": "CONFIRMED_PROGRAM",
        "createdAt": "2025-09-28T08:30:48.950Z",
        "countryOfEmployment": "israel",
        "partner": "0005",
        "visa": []
    },
    {
        "id": "cmg3tq9ep000xc83sg2j64rhn",
        "status": "NEW",
        "createdAt": "2025-09-28T14:57:40.130Z",
        "countryOfEmployment": "TURKEY",
        "partner": "ASSA",
        "visa": []
    },
    {
        "id": "cmg3v8vz0000yc83sf8323fzp",
        "status": "NEW",
        "createdAt": "2025-09-28T15:40:08.796Z",
        "countryOfEmployment": "TURKEY",
        "partner": "ASSA",
        "visa": []
    },
    {
        "id": "cmg4mkjfm0000l804j9jju1hq",
        "status": "HIRED",
        "createdAt": "2025-09-29T04:25:02.050Z",
        "countryOfEmployment": "bulgaria",
        "partner": "Inter",
        "visa": []
    },
    {
        "id": "cmg4nrkrx0002i5041c37tx87",
        "status": "NEW",
        "createdAt": "2025-09-29T04:58:29.998Z",
        "countryOfEmployment": "bulgaria",
        "partner": "nomad",
        "visa": []
    },
    {
        "id": "cmg4oegu2000ilb0484453k95",
        "status": "NEW",
        "createdAt": "2025-09-29T05:16:17.979Z",
        "countryOfEmployment": "bulgaria",
        "partner": "nomad",
        "visa": []
    }
] */
