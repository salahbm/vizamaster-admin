'use client';

import { useEffect, useRef } from 'react';

import { AlertCircleIcon, ImageIcon, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { PreviewFile } from '@/components/ui/preview-image';

import { FileType } from '@/generated/prisma';
import { useFileUpload } from '@/hooks/common/use-file-upload';
import { TFileDto } from '@/server/common/dto/files.dto';

const makeAcceptString = (accept: string) => {
  const types = accept.split(',');
  return types.map((type) => type.split('/')[1]).join(', ');
};

interface UploaderProps {
  values?: TFileDto[];
  maxFiles?: number;
  maxSizeMB?: number;
  onChange?: (files: TFileDto[]) => void;
  onDelete?: (fileKeys: string[]) => void;
  onCancelDelete?: () => void;
  accept?: string;
  multiple?: boolean;
  applicantId: string;
  fileType: string;
  deleteOnRemove?: boolean;
}

function Uploader({
  values,
  maxSizeMB = 2,
  maxFiles = 6,
  onChange,
  onDelete,
  onCancelDelete,
  accept = 'image/png,image/jpeg,image/jpg,image/gif,application/pdf',
  multiple = true,
  applicantId,
  fileType,
  deleteOnRemove = false,
}: UploaderProps) {
  const t = useTranslations();
  const maxSize = maxSizeMB * 1024 * 1024;

  const prevPendingDeletesRef = useRef<string[]>([]);
  const clearPendingRef = useRef<string[]>([]);

  const [
    { files, isDragging, errors, pendingDeletes },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple,
    maxFiles,
    values,
    applicantId,
    fileType: fileType as FileType,
    onChange,
    onCancelDelete,
    deleteOnRemove,
  });

  const isUploading = files.some((file) => file.status === 'uploading');

  // Notify parent of pending deletes only when they change
  useEffect(() => {
    // Compare arrays to avoid unnecessary calls
    if (
      onDelete &&
      (pendingDeletes.length !== prevPendingDeletesRef.current.length ||
        pendingDeletes.some(
          (key, i) => key !== prevPendingDeletesRef.current[i],
        ))
    ) {
      onDelete(pendingDeletes);
      prevPendingDeletesRef.current = [...pendingDeletes]; // Update ref
    }
  }, [pendingDeletes, onDelete]);

  useEffect(() => {
    if (pendingDeletes.length === 0) {
      clearPendingRef.current = [];
    }
    if (onCancelDelete && clearPendingRef.current.length > 0) {
      onCancelDelete();
      clearPendingRef.current = [];
    }
  }, [pendingDeletes, onCancelDelete]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative flex min-h-52 flex-col items-center overflow-hidden rounded-lg border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] md:min-h-64"
      >
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="font-body-1 mb-1.5">
            {t('Common.messages.dropYourFilesHere')}
          </p>
          <p className="text-muted-foreground font-caption-1 uppercase">
            {makeAcceptString(accept)} (max. {maxSizeMB}MB)
          </p>
          <Button
            variant="outline"
            className="mt-4"
            type="button"
            onClick={openFileDialog}
            disabled={isUploading}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            {t('Common.selectFiles')}
          </Button>
        </div>
      </div>

      {files.length > 0 && files.length < maxFiles && (
        <Button
          variant="outline"
          className="ml-auto w-fit"
          type="button"
          onClick={openFileDialog}
          disabled={isUploading}
        >
          <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
          {t('Common.uploadMore')}
        </Button>
      )}
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />

      {errors.length > 0 && (
        <div
          className="text-destructive font-caption-1 flex items-center gap-1"
          role="alert"
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          <div className="flex flex-col">
            {errors.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <PreviewFile
              file={file}
              key={file.id}
              fileKey={file.fileKey}
              className="size-10 rounded-[inherit] object-cover"
              onDelete={() => removeFile(file.id!)}
              pendingDeletes={pendingDeletes}
              status={file.status}
              error={file.error}
            />
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={clearFiles}
                disabled={isUploading}
              >
                {t('Common.removeAllFiles')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Uploader };
