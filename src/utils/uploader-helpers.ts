// uploader.helpers.ts
import { useTranslations } from 'next-intl';

import { formatBytes } from '@/utils/formats';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';

export enum FileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  ERROR = 'error',
}

export type ExtendedFileDto = TFileDto & {
  status?: FileStatus;
  error?: string;
  preview?: string;
};

export type FileUploadState = {
  files: ExtendedFileDto[];
  deletedDtos: TFileDto[];
  pendingDeletes: string[];
  isDragging: boolean;
  errors: string[];
};

export const makeAcceptString = (accept: string) => {
  const types = accept.split(',');
  return types.map((type) => type.split('/')[1]).join(', ');
};

export const stripExtended = (file: ExtendedFileDto): TFileDto => ({
  ...file,
  id: file.id as string,
});

export const validateFile = (
  file: File,
  maxSize: number,
  accept: string,
  files: ExtendedFileDto[],
  t: ReturnType<typeof useTranslations>,
) => {
  if (file.size > maxSize) {
    return t('Common.messages.fileSize', { maxSize: formatBytes(maxSize) });
  }
  if (accept !== '*') {
    const acceptedTypes = accept
      .split(',')
      .map((type) => type.trim().toLowerCase());
    const fileTypeLower = file.type.toLowerCase();
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith('.')) return fileExtension === type;
      if (type.endsWith('/*'))
        return fileTypeLower.startsWith(type.slice(0, -1));
      return fileTypeLower === type;
    });
    if (!isAccepted) return t('Common.messages.fileAcceptType', { accept });
  }
  // Check if file already exists
  const fileExists = files.some(
    (f) => f.fileName === file.name && f.fileSize === file.size,
  );
  if (fileExists) return t('Common.messages.fileExists');
  return null;
};

export const createFileDto = (
  file: File,
  applicantId: string,
  fileType: FileType,
): ExtendedFileDto => ({
  id: crypto.randomUUID(),
  applicantId,
  fileType,
  fileKey: '',
  fileName: file.name,
  fileSize: file.size,
  mimeType: file.type,
  preview: URL.createObjectURL(file),
  status: FileStatus.PENDING,
});
