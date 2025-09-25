'use client';

import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AlertCircleIcon,
  ImageIcon,
  Info,
  RotateCcw,
  UploadIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import {
  createFileDto,
  makeAcceptString,
  stripExtended,
  validateFile,
} from '@/utils/uploader-helpers';

import { FileType } from '@/generated/prisma';
import { useDeleteFile, useUpload } from '@/hooks/files';
import { TFileDto } from '@/server/common/dto/files.dto';

import { PreviewFile } from './preview-image';

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

interface UploaderProps {
  value?: TFileDto[];
  maxFiles?: number;
  maxSizeMB?: number;
  onChange?: (files: TFileDto[]) => void;
  accept?: string;
  multiple?: boolean;
  applicantId: string;
  fileType: FileType;
}

function Uploader({
  value = [],
  maxSizeMB = 2,
  maxFiles = 6,
  onChange,
  accept = 'image/png,image/jpeg,image/jpg,image/gif,application/pdf',
  multiple = true,
  applicantId,
  fileType,
}: UploaderProps) {
  const t = useTranslations();
  const maxSize = maxSizeMB * 1024 * 1024;

  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<FileUploadState>({
    files: value.map((f) => ({ ...f, status: FileStatus.UPLOADED })),
    deletedDtos: [],
    pendingDeletes: [],
    isDragging: false,
    errors: [],
  });

  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: uploadFile } = useUpload();

  useEffect(() => {
    const newUploaded = value.map((f) => ({
      ...f,
      status: FileStatus.UPLOADED,
    }));

    setState((prev) => {
      // Get current uploaded files
      const currentUploadedKeys = newUploaded
        .map((f) => f.fileKey)
        .filter(Boolean);

      // Remove deleted files
      const removed = prev.files.filter(
        (f) =>
          f.status === FileStatus.UPLOADED &&
          !currentUploadedKeys.includes(f.fileKey),
      );

      // Revoke previews for removed files
      removed.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });

      // Keep uploaded files
      const kept = prev.files.filter(
        (f) =>
          f.status !== FileStatus.UPLOADED ||
          currentUploadedKeys.includes(f.fileKey),
      );

      // Get current keys
      const currentKeys = kept
        .map((f) => f.fileKey)
        .filter((key): key is string => !!key);

      // Get files to add
      const toAdd = newUploaded.filter((f) => !currentKeys.includes(f.fileKey));

      // Update state
      return { ...prev, files: [...kept, ...toAdd], pendingDeletes: [] };
    });
  }, [value]);

  // Function to add new files for upload
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles?.length) return;
      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      setState((prev) => ({ ...prev, errors: [] }));

      if (!multiple) {
        // Revoke previews for existing local files
        state.files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
        setState((prev) => ({ ...prev, files: [] }));
      }

      if (multiple && state.files.length + newFilesArray.length > maxFiles) {
        errors.push(t('Common.messages.fileCount', { maxFiles }));
        setState((prev) => ({ ...prev, errors }));
        return;
      }

      const validDtos: ExtendedFileDto[] = [];
      const validRawFiles: File[] = [];

      newFilesArray.forEach((file) => {
        const error = validateFile(file, maxSize, accept, state.files, t);
        if (error) {
          errors.push(error);
        } else {
          const dto = createFileDto(file, applicantId, fileType);
          validDtos.push(dto);
          validRawFiles.push(file);
        }
      });

      if (validDtos.length) {
        const updatedFiles = multiple
          ? [...state.files, ...validDtos]
          : validDtos;
        // Update local state
        setState((prev) => ({ ...prev, files: updatedFiles, errors }));
        // Start uploads
        validDtos.forEach((dto, i) => {
          // Set to uploading
          setState((prev) => ({
            ...prev,
            files: prev.files.map((f) =>
              f.id === dto.id ? { ...f, status: FileStatus.UPLOADING } : f,
            ),
          }));
          const localPreview = dto.preview;
          uploadFile({ file: validRawFiles[i], applicantId, fileType })
            .then((uploaded) => {
              setState((prev) => {
                const newFiles = prev.files.map((f) =>
                  f.id === dto.id
                    ? {
                        ...f,
                        ...uploaded.data,
                        status: FileStatus.UPLOADED,
                        preview: '',
                      }
                    : f,
                );
                const active = newFiles.filter(
                  (f) =>
                    f.status === FileStatus.UPLOADED &&
                    !prev.pendingDeletes.includes(f.fileKey),
                );
                if (onChange) onChange(active.map(stripExtended));
                return { ...prev, files: newFiles };
              });
              if (localPreview) URL.revokeObjectURL(localPreview);
            })
            .catch((err) => {
              setState((prev) => {
                const newFiles = prev.files.map((f) =>
                  f.id === dto.id
                    ? { ...f, status: FileStatus.ERROR, error: err.message }
                    : f,
                );
                const active = newFiles.filter(
                  (f) =>
                    f.status === FileStatus.UPLOADED &&
                    !prev.pendingDeletes.includes(f.fileKey),
                );
                if (onChange) onChange(active.map(stripExtended));
                return { ...prev, files: newFiles };
              });
              if (localPreview) URL.revokeObjectURL(localPreview);
            });
        });
      } else if (errors.length) {
        setState((prev) => ({ ...prev, errors }));
      }

      if (inputRef.current) inputRef.current.value = '';
    },
    [
      t,
      maxFiles,
      multiple,
      state.files,
      maxSize,
      accept,
      applicantId,
      fileType,
      uploadFile,
      onChange,
    ],
  );

  const updateFiles = useCallback(
    (
      files: ExtendedFileDto[],
      pendingDeletes?: string[],
      deletedDtos?: TFileDto[],
    ) => {
      const active = files.filter(
        (f) =>
          f.status === FileStatus.UPLOADED &&
          !(pendingDeletes ?? state.pendingDeletes).includes(f.fileKey),
      );
      if (onChange) onChange(active.map(stripExtended));
      setState((prev) => ({
        ...prev,
        files,
        pendingDeletes: pendingDeletes ?? prev.pendingDeletes,
        deletedDtos: deletedDtos ?? prev.deletedDtos,
        errors: [],
      }));
    },
    [onChange, state.pendingDeletes],
  );

  const handlePendingDeletes = useCallback(
    (keys: string[]) => [...new Set([...state.pendingDeletes, ...keys])],
    [state.pendingDeletes],
  );

  const removeFile = useCallback(
    async (id: string) => {
      const file = state.files.find((f) => f.id === id);
      if (!file) return;

      const revoke = () => file.preview && URL.revokeObjectURL(file.preview);
      const filteredFiles = state.files.filter((f) => f.id !== id);

      if (!file.fileKey) {
        revoke();
        updateFiles(filteredFiles);
        return;
      }

      const gray = handlePendingDeletes([file.fileKey]);
      setState((p) => ({ ...p, pendingDeletes: gray, errors: [] }));
    },
    [state, handlePendingDeletes, updateFiles],
  );

  const clearFiles = useCallback(async () => {
    const localFiles = state.files.filter((f) => !f.fileKey);
    const uploadedFiles = state.files.filter((f) => !!f.fileKey);

    // Revoke previews for local files
    localFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));

    const newPendingDeletesGray = handlePendingDeletes(
      uploadedFiles.map((f) => f.fileKey),
    );

    setState((p) => ({
      ...p,
      pendingDeletes: newPendingDeletesGray,
      errors: [],
    }));

    if (inputRef.current) inputRef.current.value = '';
  }, [state, handlePendingDeletes]);

  const handleDelete = useCallback(async () => {
    if (!state.pendingDeletes.length) return;

    await Promise.all(
      state.pendingDeletes.map((key) =>
        deleteFile({ fileKey: key, applicantId }),
      ),
    );

    setState((p) => ({ ...p, pendingDeletes: [], errors: [] }));
    if (inputRef.current) inputRef.current.value = '';
  }, [state, applicantId, deleteFile]);

  // Function to clear pending deletes and recover files
  const clearPendingDeletes = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newPendingDeletes: string[] = [];
      let newFiles = state.files;
      let newDeletedDtos: TFileDto[] = [];

      const active = newFiles.filter(
        (f) =>
          f.status === FileStatus.UPLOADED &&
          !newPendingDeletes.includes(f.fileKey),
      );

      if (onChange) onChange(active.map(stripExtended));
      setState((prev) => ({
        ...prev,
        files: newFiles,
        deletedDtos: newDeletedDtos,
        pendingDeletes: newPendingDeletes,
      }));
    },
    [onChange, state.files],
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));
      if (inputRef.current?.disabled || !e.dataTransfer.files?.length) return;
      const files = multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]];
      addFiles(files);
    },
    [addFiles, multiple],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: 'file',
      onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple ?? multiple,
      ref: inputRef,
    }),
    [accept, multiple, handleFileChange],
  );

  const isUploading = state.files.some(
    (f) => f.status === FileStatus.UPLOADING || f.status === FileStatus.PENDING,
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={state.isDragging || undefined}
        data-files={state.files.length > 0 || undefined}
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

      {state.files.length > 0 && state.files.length < maxFiles && (
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

      {state.errors.length > 0 && (
        <div
          className="text-destructive font-caption-1 flex items-center gap-1"
          role="alert"
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          <div className="flex flex-col">
            {state.errors.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        </div>
      )}

      {/* File list */}
      {state.files.length > 0 && (
        <div className="space-y-2">
          {state.files.map((file, index) => (
            <PreviewFile
              file={file}
              key={index}
              applicantId={applicantId}
              className="size-10 rounded-[inherit] object-cover"
              onDelete={() => removeFile(file.id!)}
              pendingDeletes={state.pendingDeletes}
            />
          ))}

          {/* Remove all files button */}
          {state.files.length > 1 && (
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

      <p className="font-caption-1 text-muted-foreground text-end">
        <Info className="mr-2 inline-block size-4 text-inherit" />
        {t('Common.messages.uploadsSavedDeletesManual')}
      </p>
      <div className="mt-2 flex justify-end gap-2 border-t pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={clearPendingDeletes}
          disabled={isUploading || !state.pendingDeletes.length}
        >
          <RotateCcw aria-hidden="true" />
          {t('Common.reset')}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="w-36"
          disabled={isUploading || !state.pendingDeletes.length}
          onClick={handleDelete}
        >
          {t('Common.delete')}
        </Button>
      </div>
    </div>
  );
}

export { Uploader };
