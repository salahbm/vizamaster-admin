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

import { useTranslations } from 'next-intl';

import { formatBytes } from '@/utils/formats';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';

import { useDeleteFile, useUpload } from '../files';

export type FileUploadOptions = {
  values?: TFileDto[] | null;
  maxSize?: number;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: TFileDto[]) => void;
  /**
   * @description applicant id to upload files
   */
  applicantId: string;
  /**
   * @description file type to folder upload files
   */
  fileType: FileType;
  /**
   * @description if exists, returns ids to parent component
   */
  getPendingDeletes?: (fileKeys: string[]) => void;
  /**
   * @description if grayScale, keep removed files in the list but mark for deletion (UI can gray them out), recoverable.
   * @description if hide, remove files from the list but store for potential recovery.
   * @description if delete, permanently delete from DB, unrecoverable.
   * @default 'grayScale'
   */
  removeType?: 'hide' | 'grayScale' | 'delete';
};

enum FileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  ERROR = 'error',
}

export type ExtendedFileDto = TFileDto & {
  id: string;
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

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => Promise<void>;
  clearFiles: () => Promise<void>;
  clearErrors: () => void;
  clearPendingDeletes: (e: React.MouseEvent) => void;
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
    removeType = 'grayScale',
    maxFiles = Infinity,
    maxSize = Infinity,
    multiple = false,
    accept = '*',
    applicantId,
    fileType,
    values,
    onChange,
    getPendingDeletes,
  } = options;

  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<FileUploadState>({
    files: (values || []).map((f) => ({
      ...f,
      id: f.id || crypto.randomUUID(),
      status: FileStatus.UPLOADED,
    })),
    deletedDtos: [],
    pendingDeletes: [],
    isDragging: false,
    errors: [],
  });

  // Sync prop values to local state if external changes occur, reconciling with deleted items based on removeType
  useEffect(() => {
    if (!values) return;
    setState((prev) => {
      let newFiles = values.map((f) => ({
        ...f,
        id: f.id || crypto.randomUUID(),
        status: FileStatus.UPLOADED,
      }));
      if (removeType === 'grayScale') {
        // Add back deleted items for grayScale mode to keep them visible
        newFiles = [
          ...newFiles,
          ...prev.deletedDtos.map((d) => ({
            ...d,
            id: crypto.randomUUID(),
            status: FileStatus.UPLOADED,
          })),
        ];
      }
      return { ...prev, files: newFiles };
    });
  }, [values, removeType]);

  const { mutateAsync: deleteFile } = useDeleteFile();
  const { mutateAsync: uploadFile } = useUpload();

  // Helper to strip extended fields for onChange calls
  const stripExtended = (file: ExtendedFileDto): TFileDto => ({
    ...file,
    // Remove extended fields; adjust if TFileDto includes 'id'
    id: file.id as string, // Assuming TFileDto has id; remove if not
  });

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
      // Check if file already exists
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
      applicantId,
      fileType,
      fileKey: '',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      preview: URL.createObjectURL(file),
      status: FileStatus.PENDING,
    }),
    [applicantId, fileType],
  );

  // Function to upload a file and update state accordingly
  const uploadAndUpdate = useCallback(
    async (file: File, dto: ExtendedFileDto) => {
      // Update status to uploading
      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === dto.id ? { ...f, status: FileStatus.UPLOADING } : f,
        ),
      }));

      try {
        const uploaded = await uploadFile({ file, applicantId, fileType });
        // Update the file with uploaded data
        const updatedFiles = state.files.map((f) =>
          f.id === dto.id
            ? {
                ...f,
                status: FileStatus.UPLOADED,
                ...uploaded.data,
              }
            : f,
        );
        // Notify parent of changes (active files only)
        const activeFiles = updatedFiles.filter(
          (f) => !state.pendingDeletes.includes(f.fileKey),
        );
        if (onChange) onChange(activeFiles.map(stripExtended));
        // Update local state
        setState((prev) => ({ ...prev, files: updatedFiles }));
      } catch (err) {
        const errorMsg = (err as Error).message;
        // Update status to error
        const updatedFiles = state.files.map((f) =>
          f.id === dto.id
            ? { ...f, status: FileStatus.ERROR, error: errorMsg }
            : f,
        );
        // Notify parent
        const activeFiles = updatedFiles.filter(
          (f) => !state.pendingDeletes.includes(f.fileKey),
        );
        if (onChange) onChange(activeFiles.map(stripExtended));
        // Update local state with error
        setState((prev) => ({
          ...prev,
          files: updatedFiles,
          errors: [...prev.errors, errorMsg],
        }));
      }
    },
    [
      uploadFile,
      applicantId,
      fileType,
      onChange,
      state.files,
      state.pendingDeletes,
    ],
  );

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
        const updatedFiles = multiple
          ? [...state.files, ...validDtos]
          : validDtos;
        // Notify parent with active files
        const activeFiles = updatedFiles.filter(
          (f) => !state.pendingDeletes.includes(f.fileKey),
        );
        if (onChange) onChange(activeFiles.map(stripExtended));
        // Update local state
        setState((prev) => ({ ...prev, files: updatedFiles, errors }));
        // Start uploads
        validRawFiles.forEach((file, i) => uploadAndUpdate(file, validDtos[i]));
      } else if (errors.length) {
        setState((prev) => ({ ...prev, errors }));
      }

      if (inputRef.current) inputRef.current.value = '';
    },
    [
      t,
      maxFiles,
      multiple,
      onChange,
      state.files,
      validateFile,
      createFileDto,
      uploadAndUpdate,
      state.pendingDeletes,
    ],
  );

  // Function to remove a file based on removeType
  const removeFile = useCallback(
    async (id: string) => {
      const fileToRemove = state.files.find((f) => f.id === id);
      if (!fileToRemove) return;

      if (!fileToRemove.fileKey) {
        // Local file (not uploaded): discard and revoke preview
        if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
        const newFiles = state.files.filter((f) => f.id !== id);
        const activeFiles = newFiles.filter(
          (f) => !state.pendingDeletes.includes(f.fileKey),
        );
        if (onChange) onChange(activeFiles.map(stripExtended));
        setState((prev) => ({ ...prev, files: newFiles, errors: [] }));
        return;
      }

      // Uploaded file
      if (removeType === 'delete') {
        try {
          await deleteFile({ fileKey: fileToRemove.fileKey, applicantId });
          const newFiles = state.files.filter((f) => f.id !== id);
          if (onChange) onChange(newFiles.map(stripExtended));
          setState((prev) => ({ ...prev, files: newFiles, errors: [] }));
        } catch (err) {
          setState((prev) => ({
            ...prev,
            errors: [...prev.errors, (err as Error).message],
          }));
        }
      } else {
        // Recoverable remove
        const newPendingDeletes = [
          ...new Set([...state.pendingDeletes, fileToRemove.fileKey]),
        ];
        let newFiles = state.files;
        let newDeletedDtos = [
          ...state.deletedDtos,
          stripExtended(fileToRemove),
        ];
        if (removeType === 'hide') {
          newFiles = state.files.filter((f) => f.id !== id);
          // Revoke preview if hiding (not needed for recovery)
          if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
        }
        const activeFiles = newFiles.filter(
          (f) => !newPendingDeletes.includes(f.fileKey),
        );
        if (onChange) onChange(activeFiles.map(stripExtended));
        if (getPendingDeletes) getPendingDeletes(newPendingDeletes);
        setState((prev) => ({
          ...prev,
          files: newFiles,
          deletedDtos: newDeletedDtos,
          pendingDeletes: newPendingDeletes,
          errors: [],
        }));
      }
    },
    [
      removeType,
      onChange,
      getPendingDeletes,
      deleteFile,
      applicantId,
      state.files,
      state.pendingDeletes,
      state.deletedDtos,
    ],
  );

  // Function to clear all files based on removeType
  const clearFiles = useCallback(async () => {
    const localFiles = state.files.filter((f) => !f.fileKey);
    const uploadedFiles = state.files.filter((f) => !!f.fileKey);

    // Revoke previews for local files
    localFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));

    if (removeType === 'delete') {
      try {
        await Promise.all(
          uploadedFiles.map((f) =>
            deleteFile({ fileKey: f.fileKey, applicantId }),
          ),
        );
        if (onChange) onChange([]);
        setState((prev) => ({
          ...prev,
          files: [],
          pendingDeletes: [],
          errors: [],
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          errors: [...prev.errors, (err as Error).message],
        }));
      }
    } else {
      // Recoverable clear
      const newPendingDeletes = [
        ...new Set([
          ...state.pendingDeletes,
          ...uploadedFiles.map((f) => f.fileKey),
        ]),
      ];
      let newFiles: ExtendedFileDto[] = [];
      let newDeletedDtos = [
        ...state.deletedDtos,
        ...uploadedFiles.map(stripExtended),
      ];
      if (removeType === 'grayScale') {
        newFiles = uploadedFiles; // Keep for display (will be added back in useEffect if needed)
      } // For 'hide', newFiles = []
      if (onChange) onChange([]);
      if (getPendingDeletes) getPendingDeletes(newPendingDeletes);
      setState((prev) => ({
        ...prev,
        files: newFiles,
        deletedDtos: newDeletedDtos,
        pendingDeletes: newPendingDeletes,
        errors: [],
      }));
    }

    if (inputRef.current) inputRef.current.value = '';
  }, [
    removeType,
    onChange,
    getPendingDeletes,
    deleteFile,
    applicantId,
    state.files,
    state.pendingDeletes,
    state.deletedDtos,
  ]);

  // Function to clear errors
  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  // Function to clear pending deletes and recover files
  const clearPendingDeletes = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newPendingDeletes: string[] = [];
      let newFiles = state.files;
      let newDeletedDtos: TFileDto[] = [];
      if (removeType === 'hide') {
        // Recover by adding back to files
        newFiles = [
          ...state.files,
          ...state.deletedDtos.map((d) => ({
            ...d,
            id: crypto.randomUUID(),
            status: FileStatus.UPLOADED,
          })),
        ];
      } else {
        // For grayScale and delete, just clear pending (files already include or permanent)
      }
      const activeFiles = newFiles.filter(
        (f) => !newPendingDeletes.includes(f.fileKey),
      );
      if (getPendingDeletes) getPendingDeletes(newPendingDeletes);
      if (onChange) onChange(activeFiles.map(stripExtended));
      setState((prev) => ({
        ...prev,
        files: newFiles,
        deletedDtos: newDeletedDtos,
        pendingDeletes: newPendingDeletes,
      }));
    },
    [removeType, onChange, getPendingDeletes, state.files, state.deletedDtos],
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
