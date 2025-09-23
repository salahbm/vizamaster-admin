import agent from '@/lib/agent';

import { FileType } from '@/generated/prisma';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
}

interface UploadResponse {
  signedUrl: string;
  fileId: string;
  fileUrl: string;
}

const upload = async ({
  file,
  applicantId,
  fileType,
}: UploadParams): Promise<UploadResponse> => {
  // First get a signed URL
  const response = await agent.post<UploadResponse>('/api/upload', {
    key: file.name,
    contentType: file.type,
    applicantId,
    fileType,
  });

  // Then upload the file directly to S3
  await agent.put(response.signedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  return response;
};

export const useUpload = () =>
  useMutation({
    mutationFn: upload,
  });
