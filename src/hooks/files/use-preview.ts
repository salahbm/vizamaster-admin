import { useQuery } from '@tanstack/react-query';

import agent from '@/lib/agent';
import { objectToSearchParams } from '@/lib/object-to-params';

import { QueryKeys } from '@/constants/query-keys';

import { FileType } from '@/generated/prisma';

interface PreviewUrlResponse {
  signedUrl: string;
}

const getPreviewUrl = async ({
  fileKey,
  applicantId,
  fileType,
}: {
  fileKey: string;
  applicantId: string;
  fileType: FileType;
}): Promise<PreviewUrlResponse> => {
  const params = objectToSearchParams({
    fileKey,
    applicantId,
    fileType,
  });

  const response = await agent.get<{ data: PreviewUrlResponse }>(
    `/api/files/preview?${params}`,
  );
  return response.data;
};

export const usePreviewUrl = ({
  fileKey,
  applicantId,
  fileType,
}: {
  fileKey: string;
  applicantId: string;
  fileType: FileType;
}) => {
  return useQuery({
    queryKey: [...QueryKeys.files.preview, { fileKey, applicantId, fileType }],
    queryFn: () => getPreviewUrl({ fileKey, applicantId, fileType }),
    enabled: Boolean(fileKey && applicantId && fileType),
  });
};
