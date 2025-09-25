import { create } from 'zustand';

import { TFileDto } from '@/server/common/dto/files.dto';

enum FileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  ERROR = 'error',
}

interface File extends TFileDto {
  status?: FileStatus;
  error?: string;
}

interface FilesStore {
  files: File[] | null;
  setFiles: (files: File[]) => void;

  newFiles: File[] | null;
  setNewFiles: (files: File[]) => void;

  pendingDeletes: string[] | null;
  setPendingDeletes: (files: string[]) => void;

  erasePendingDelete: (fileId: string) => void;
  restoreRemovedFiles: (fileId: string) => void;

  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;

  errors: string[];
  setErrors: (errors: string[]) => void;
}

export const useFilesStore = create<FilesStore>()((set, get) => ({
  files: null,
  newFiles: null,
  pendingDeletes: null,
  setFiles: (files: File[]) => set({ files }), // list of files from server
  setNewFiles: (files: File[]) => set({ newFiles: files }), // new files list after local remove or upload
  setPendingDeletes: (files: string[]) => set({ pendingDeletes: files }), // list of files to be deleted from server

  // Erases a file from pendingDeletes (when delete is confirmed)
  erasePendingDelete: (fileId: string) => {
    const { pendingDeletes } = get();
    if (!pendingDeletes) return;

    set({
      pendingDeletes: pendingDeletes.filter((id) => id !== fileId),
    });
  },

  // Restores a file from pendingDeletes back to files (when delete is cancelled)
  restoreRemovedFiles: (fileId: string) => {
    const { files, newFiles, pendingDeletes } = get();
    if (!pendingDeletes?.includes(fileId)) return;

    // Find the file in newFiles (most recent state)
    const fileToRestore = newFiles?.find((f) => f.fileKey === fileId);
    if (!fileToRestore) return;

    set({
      // Add back to files
      files: files ? [...files, fileToRestore] : [fileToRestore],
      // Remove from pendingDeletes
      pendingDeletes: pendingDeletes.filter((id) => id !== fileId),
    });
  },

  isDragging: false,
  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  errors: [],
  setErrors: (errors: string[]) => set({ errors }),
}));
