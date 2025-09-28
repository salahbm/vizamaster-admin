import { useRouter } from 'next/navigation';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { Applicant, ApplicantStatus, Gender } from '@/generated/prisma';
import { TApplicantDto } from '@/server/common/dto/applicant.dto';
import { NotFoundError } from '@/server/common/errors';
import { PaginatedResult, TResponse } from '@/server/common/types';
import { generateUserId } from '@/server/common/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { ISort } from '@/types/data-table';

import useMutation from '../common/use-mutation';

// CREATE APPLICANT
const createApplicant = (
  data: TApplicantDto,
  creatorEmail: string,
): Promise<Applicant> => {
  const userId = generateUserId();
  const mappedData: Omit<
    Applicant,
    'id' | 'createdAt' | 'updatedAt' | 'isArchived' | 'isAlert'
  > = {
    ...data,
    userId,
    gender: data.gender as Gender,
    status: ApplicantStatus.NEW,
    createdBy: creatorEmail,
    updatedBy: creatorEmail,
  };

  return agent.post('/api/applicant', mappedData);
};

export const useCreateApplicant = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: TApplicantDto) => createApplicant(data, user?.email!),
    options: {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.all,
            {
              country: variables.countryOfEmployment,
              partner: variables.partner,
            },
          ],
          type: 'all',
        });
        router.back();
      },
    },
  });
};

// GET ALL APPLICANTS

export interface IGetAllApplicantsParams {
  page: number;
  size: number;
  sort: ISort;
  search?: string;
  country?: string;
  partner?: string;
  isArchived?: boolean;
  isAlert?: boolean;
  status?: string;
  jobTitle?: string;
}

const getAllApplicants = async (
  params: IGetAllApplicantsParams,
): Promise<PaginatedResult<Applicant>> => {
  const queries = objectToSearchParams(
    params as unknown as Record<string, unknown>,
  );

  const { data } = await agent.get<TResponse<PaginatedResult<Applicant>>>(
    `/api/applicant?${queries}`,
  );

  if (!data) throw new NotFoundError('Applicants not found');

  return data;
};

export const useGetAllApplicants = (params: IGetAllApplicantsParams) => {
  return useQuery({
    queryKey: [...QueryKeys.applicants.all, { ...params }],
    queryFn: () => getAllApplicants(params),
    placeholderData: keepPreviousData,
  });
};
