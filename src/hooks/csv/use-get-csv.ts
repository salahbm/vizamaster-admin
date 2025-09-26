import agent from '@/lib/agent';

import useMutation from '../common/use-mutation';

const getAllCsv = async () => await agent.get(`/api/applicant/csv`);

export const useGetCsv = () => useMutation({ mutationFn: getAllCsv });
