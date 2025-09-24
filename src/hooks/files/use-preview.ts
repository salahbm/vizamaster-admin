import { useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

interface PreviewUrlResponse {
  signedUrl: string;
}

const getPreviewUrl = async ({
  fileKey,
}: {
  fileKey: string;
}): Promise<PreviewUrlResponse> => {
  const response = await agent.get<{ data: PreviewUrlResponse }>(
    `/api/files/preview?fileKey=${fileKey}`,
  );
  return response.data;
};

export const usePreviewUrl = (fileKey: string) => {
  return useQuery({
    queryKey: [...QueryKeys.files.preview, { fileKey }],
    queryFn: () => getPreviewUrl({ fileKey }),
    enabled: Boolean(fileKey),
  });
};
