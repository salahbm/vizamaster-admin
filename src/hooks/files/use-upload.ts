import agent from '@/lib/agent';

import useMutation from '../common/use-mutation';

const upload = async ({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}): Promise<string> => agent.post('/api/upload', { key, contentType });

export const useUpload = () =>
  useMutation({
    mutationFn: upload,
  });
