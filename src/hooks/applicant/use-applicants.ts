import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';
import { mapFilesIntoUrl } from '@/lib/utils';

import { QueryKeys } from '@/constants/query-keys';

import { Applicant, ApplicantStatus, Gender } from '@/generated/prisma';
import { TApplicantDto } from '@/server/common/dto/applicant.dto';
import { generateUserId } from '@/server/common/utils';
import { useAuthStore } from '@/store/auth-store';

import useMutation from '../common/use-mutation';

const createApplicant = (
  data: TApplicantDto,
  creatorEmail: string,
): Promise<Applicant> => {
  const userId = generateUserId();
  const passportPhoto = mapFilesIntoUrl(data.passportPhoto);
  const mappedData: Omit<
    Applicant,
    'id' | 'createdAt' | 'updatedAt' | 'isArchived'
  > = {
    ...data,
    userId,
    passportPhoto,
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
          queryKey: QueryKeys.applicants.all,
        });
        router.replace(
          `/applicant/${variables.countryOfEmployment}/${variables.partner}`,
        );
      },
    },
  });
};
