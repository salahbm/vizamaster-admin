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
  // Step 1: Get presigned URL from our API (no file buffer sent to Vercel)
  const presignedResponse = await agent.post<
    IResponse<{ signedUrl: string; fileKey: string }>
  >('/api/files/presigned-url', {
    fileName: file.name,
    contentType: file.type,
    applicantId,
    fileType,
  });

  const { signedUrl, fileKey } = presignedResponse.data;

  // Step 2: Upload file directly to R2 using presigned URL (bypasses Vercel)
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to R2');
  }

  // Step 3: Create file record in database
  const res = await agent.post<IResponse<TFileDto>>(
    '/api/files/confirm-upload',
    {
      fileName: file.name,
      contentType: file.type,
      applicantId,
      fileType,
      fileKey,
      fileSize: file.size,
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
