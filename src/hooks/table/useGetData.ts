import { keepPreviousData, useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLogin: Date;
  loginCount: number;
};

export type PaginatedResponse = {
  data: User[];
  paging: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

async function getData(
  page: number,
  size: number,
  sort: string,
): Promise<PaginatedResponse> {
  const response = await fetch(
    `/api/table?page=${page}&size=${size}&sort=${sort}`,
  );
  const data = await response.json();
  return (
    data ?? {
      data: [],
      paging: { page: 0, size: 0, totalPages: 0, totalElements: 0 },
    }
  );
}

export const useGetData = (page: number, size: number, sort: string) =>
  useQuery({
    queryKey: ['table-data', { page, size, sort }],
    queryFn: () => getData(page, size, sort),
    placeholderData: keepPreviousData,
  });
