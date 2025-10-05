import { useQueryClient } from '@tanstack/react-query';

import agent from '@/lib/agent';

import { QueryKeys } from '@/constants/query-keys';

import { Applicant, FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';
import { IResponse } from '@/types/global';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
}

type MutationContext = {
  previousData: TFileDto[] | undefined;
};

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
      onMutate: (variables: UploadParams) => {
        queryClient.cancelQueries({
          queryKey: [
            ...QueryKeys.applicants.details,
            { id: variables.applicantId },
          ],
        });

        const previousData = queryClient.getQueryData<
          Applicant & { files: TFileDto[] }
        >([...QueryKeys.applicants.details, { id: variables.applicantId }]);

        queryClient.setQueryData(
          [...QueryKeys.applicants.details, { id: variables.applicantId }],
          (oldData: Applicant & { files: TFileDto[] }) => {
            if (!oldData) return oldData;

            const newFile = {
              id: 'temp-' + Date.now(),
              fileName: variables.file.name,
              fileType: variables.fileType,
              fileSize: variables.file.size,
              fileUrl: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const updatedList = {
              ...oldData,
              files: [...oldData.files, newFile],
            };

            return updatedList;
          },
        );

        return { previousData };
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (_err, variables, context: unknown) => {
        const mutationContext = context as MutationContext;
        if (mutationContext?.previousData) {
          queryClient.setQueryData(
            [...QueryKeys.applicants.details, { id: variables.applicantId }],
            mutationContext.previousData,
          );
        }
      },
      onSuccess: (data, variables) => {
        // Instead of invalidating, update the query data with the actual server response
        queryClient.setQueryData(
          [...QueryKeys.applicants.details, { id: variables.applicantId }],
          (oldData: (Applicant & { files: TFileDto[] }) | undefined) => {
            if (!oldData) return oldData;

            // Find the temporary file and replace it with the actual file from the server
            const actualFile = data.data;
            const updatedFiles = oldData.files.map((file) => {
              // Replace the temporary file with the actual file
              if (
                file.id.startsWith('temp-') &&
                file.fileName === actualFile.fileName
              ) {
                return actualFile;
              }
              return file;
            });

            return {
              ...oldData,
              files: updatedFiles,
            };
          },
        );
      },
    },
  });
};
