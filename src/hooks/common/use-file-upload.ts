'use client';

import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';

import { formatBytes } from '@/utils/formats';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';
import { useFilesStore } from '@/store/use-files-store';

import { useDeleteFile, useUpload } from '../files';

export type FileUploadOptions = {
  values?: TFileDto[] | null;
  maxSize?: number;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
  applicantId: string;
  fileType: FileType;
  deleteOnRemove?: boolean;
  onChange?: (files: TFileDto[]) => void;
  onDelete?: (fileKeys: string[]) => void; // Changed to sync pending deletes
  onCancelDelete?: () => void; // Changed to handle cancel action
};

export type ExtendedFileDto = TFileDto & {
  status?: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
};

export type FileUploadState = {
  files: ExtendedFileDto[];
  pendingDeletes: string[];
  isDragging: boolean;
  errors: string[];
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => Promise<void>;
  clearFiles: () => Promise<void>;
  clearErrors: () => void;
  clearPendingDeletes: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>,
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

export const useFileUpload = (
  options: FileUploadOptions,
): [FileUploadState, FileUploadActions] => {
  const {
    deleteOnRemove = false,
    maxFiles = Infinity,
    maxSize = Infinity,
    multiple = false,
    accept = '*',
    applicantId,
    fileType,
    values,
    onChange,
    onCancelDelete,
  } = options;

  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<FileUploadState>({
    files: (values || []).map((f) => ({ ...f, status: 'uploaded' })),
    pendingDeletes: [],
    isDragging: false,
    errors: [],
  });

  const { mutateAsync: uploadFile } = useUpload();
  const { mutateAsync: deleteFile } = useDeleteFile();
  const { setFiles } = useFilesStore();

  const validateFile = useCallback(
    (file: File): string | null => {
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

      // check is file already exists
      const fileExists = state.files.some(
        (f) => f.fileName === file.name && f.fileSize === file.size,
      );
      if (fileExists) return t('Common.messages.fileExists');
      return null;
    },
    [accept, maxSize, t, state.files],
  );

  const createFileDto = useCallback(
    (file: File): ExtendedFileDto => ({
      id: crypto.randomUUID(),
      applicantId: '',
      fileType: FileType.OTHER,
      fileKey: '',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }),
    [],
  );

  const uploadAndUpdate = useCallback(
    async (file: File, dto: ExtendedFileDto) => {
      try {
        setState((prev) => ({
          ...prev,
          files: prev.files.map((f) =>
            f.id === dto.id ? { ...f, status: 'uploading' } : f,
          ),
        }));
        const uploaded = await uploadFile({ file, applicantId, fileType });
        setState((prev) => ({
          ...prev,
          files: prev.files.map((f) =>
            f.id === dto.id
              ? { ...uploaded, preview: f.preview, status: 'uploaded' }
              : f,
          ),
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          files: prev.files.map((f) =>
            f.id === dto.id
              ? { ...f, status: 'error', error: (err as Error).message }
              : f,
          ),
          errors: [...prev.errors, (err as Error).message],
        }));
      }
    },
    [uploadFile, applicantId, fileType],
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles?.length) return;
      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      setState((prev) => ({ ...prev, errors: [] }));

      if (!multiple) {
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
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          const dto = createFileDto(file);
          validDtos.push(dto);
          validRawFiles.push(file);
        }
      });

      if (validDtos.length) {
        setState((prev) => {
          const updatedFiles = multiple
            ? [...prev.files, ...validDtos]
            : validDtos;
          if (onChange) onChange(updatedFiles);
          return { ...prev, files: updatedFiles, errors };
        });

        validRawFiles.forEach((file, i) => uploadAndUpdate(file, validDtos[i]));
      } else if (errors.length) {
        setState((prev) => ({ ...prev, errors }));
      }

      if (inputRef.current) inputRef.current.value = '';
    },
    [
      t,
      maxFiles,
      onChange,
      multiple,
      state.files,
      validateFile,
      createFileDto,
      uploadAndUpdate,
    ],
  );

  const removeFile = useCallback(
    async (id: string) => {
      const fileToRemove = state.files.find((f) => f.id === id);
      if (!fileToRemove) return;

      if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);

      setState((prev) => {
        const newFiles = prev.files.filter((f) => f.id !== id);
        const newPendingDeletes = fileToRemove.fileKey
          ? [...prev.pendingDeletes, fileToRemove.fileKey]
          : prev.pendingDeletes;
        if (onChange) onChange(newFiles);
        return {
          ...prev,
          files: newFiles,
          pendingDeletes: newPendingDeletes,
          errors: [],
        };
      });

      if (deleteOnRemove && fileToRemove.fileKey) {
        try {
          await deleteFile({
            fileKey: fileToRemove.fileKey,
            applicantId,
          });
          setState((prev) => ({
            ...prev,
            pendingDeletes: prev.pendingDeletes.filter(
              (k) => k !== fileToRemove.fileKey,
            ),
          }));
        } catch (err) {
          setState((prev) => ({
            ...prev,
            errors: [...prev.errors, (err as Error).message],
          }));
        }
      }
    },
    [onChange, deleteOnRemove, deleteFile, applicantId, state.files],
  );

  const clearFiles = useCallback(async () => {
    setState((prev) => {
      prev.files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      const newPendingDeletes = [
        ...prev.pendingDeletes,
        ...prev.files.filter((f) => !!f.fileKey).map((f) => f.fileKey),
      ];
      if (onChange) onChange([]);
      if (inputRef.current) inputRef.current.value = '';
      return {
        ...prev,
        files: [],
        pendingDeletes: newPendingDeletes,
        errors: [],
      };
    });

    if (deleteOnRemove) {
      try {
        await Promise.all(
          state.pendingDeletes.map((key) =>
            deleteFile({ fileKey: key, applicantId }),
          ),
        );
        setState((prev) => ({ ...prev, pendingDeletes: [] }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          errors: [...prev.errors, (err as Error).message],
        }));
      }
    }
  }, [onChange, deleteOnRemove, deleteFile, applicantId, state.pendingDeletes]);

  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  const clearPendingDeletes = useCallback(() => {
    setState((prev) => ({ ...prev, pendingDeletes: [] }));
    if (onCancelDelete) onCancelDelete();
  }, [onCancelDelete]);

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

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      clearPendingDeletes,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};
