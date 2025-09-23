import agent from '@/lib/agent';

import { FileType } from '@/generated/prisma';
import { InternalServerError } from '@/server/common/errors';

import useMutation from '../common/use-mutation';

interface UploadParams {
  file: File;
  applicantId: string;
  fileType: FileType;
  onProgress?: (progress: number) => void;
}

interface UploadResponse {
  signedUrl: string;
  fileUrl: string;
}

const upload = async ({
  file,
  applicantId,
  fileType,
  onProgress,
}: UploadParams): Promise<{ fileUrl: string }> => {
  // 1. Get signed URL
  const response = await agent.post<UploadResponse>('/api/upload', {
    key: file.name,
    contentType: file.type,
    applicantId,
    fileType,
  });

  // 2. Upload with XHR for progress
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', response.signedUrl, true);

    // Set required headers for R2
    xhr.setRequestHeader('Content-Type', file.type);
    // Don't set x-amz headers here, they're in the signed URL

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        console.error('Upload failed:', {
          status: xhr.status,
          response: xhr.response,
          statusText: xhr.statusText,
        });
        reject(new Error(`Upload failed: ${xhr.statusText || xhr.status}`));
      }
    };

    xhr.onerror = (error) => {
      console.error('Upload network error:', error);
      reject(new InternalServerError('Upload failed - network error'));
    };

    xhr.send(file);
  });

  return { fileUrl: response.fileUrl };
};

export const useUpload = () => useMutation({ mutationFn: upload });
