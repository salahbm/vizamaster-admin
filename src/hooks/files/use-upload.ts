import agent from '@/lib/agent';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';
import { IResponse } from '@/types/global';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
}

const upload = async ({
  file,
  applicantId,
  fileType,
}: UploadParams): Promise<TFileDto> => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('contentType', file.type);
  formData.append('applicantId', applicantId);
  formData.append('fileType', fileType);
  formData.append('fileSize', file.size.toString());

  const { data } = await agent.post<IResponse<TFileDto>>(
    '/api/files/upload',
    formData,
    {
      headers: { Accept: 'application/json' },
    },
  );

  return data;
};

export const useUpload = () =>
  useMutation({ mutationFn: upload, options: { meta: { toast: false } } });
