import agent from '@/lib/agent';

import useMutation from '../common/use-mutation';

const getSingleCsv = async (id: string) =>
  await agent.get(`/api/applicant/csv/${id}`);

export const useGetSingleCsv = () => useMutation({ mutationFn: getSingleCsv });
