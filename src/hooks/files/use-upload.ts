import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';
import { IResponse } from '@/types/global';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
}

const upload = async ({ file, applicantId, fileType }: UploadParams) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('contentType', file.type);
  formData.append('applicantId', applicantId);
  formData.append('fileType', fileType);
  formData.append('fileSize', file.size.toString());

  const res = await agent.post<IResponse<TFileDto>>(
    '/api/files/upload',
    formData,
    {
      headers: { Accept: 'application/json' },
    },
  );

  return res;
};

export const useUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upload,
    options: {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            ...QueryKeys.applicants.details,
            { id: variables.applicantId },
          ],
        });
      },
    },
  });
};
