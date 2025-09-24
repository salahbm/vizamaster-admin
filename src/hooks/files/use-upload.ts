import agent from '@/lib/agent';

import { FileType } from '@/generated/prisma';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
  onProgress?: (progress: number) => void;
}

const upload = async ({
  file,
  applicantId,
  fileType,
  onProgress,
}: UploadParams): Promise<{ fileUrl: string }> => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('contentType', file.type);
  formData.append('applicantId', applicantId);
  formData.append('fileType', fileType);
  formData.append('fileSize', file.size.toString());

  const response = await agent.post<{ data: { fileUrl: string } }>(
    '/api/upload',
    formData,
    { headers: { Accept: 'application/json' } },
  );

  console.info('Upload response:', response);

  if (onProgress) {
    onProgress(100);
  }

  return { fileUrl: response.data.fileUrl };
};

export const useUpload = () =>
  useMutation({ mutationFn: upload, options: { meta: { toast: false } } });
