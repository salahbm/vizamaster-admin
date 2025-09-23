import agent from '@/lib/agent';

import useMutation from '../common/use-mutation';

const getSignedUrl = async ({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}): Promise<string> => agent.post('/api/upload', { key, contentType });

export const useSignedUrl = () =>
  useMutation({
    mutationFn: getSignedUrl,
  });
