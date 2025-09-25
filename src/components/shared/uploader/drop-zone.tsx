import { type DragEvent } from 'react';

import { ImageIcon, RotateCcw, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { makeAcceptString } from '@/utils/uploader-helpers';

interface DropZoneProps {
  accept: string;
  maxSizeMB: number;
  isUploading: boolean;
  isDragging: boolean;
  hasFiles: boolean;
  hasPendingDeletes: boolean;
  onDragEnter: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onFileSelect: () => void;
  onResetPendingDeletes: (e: React.MouseEvent) => void;
}

export const DropZone = ({
  accept,
  maxSizeMB,
  isUploading,
  isDragging,
  hasFiles,
  hasPendingDeletes,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onResetPendingDeletes,
}: DropZoneProps) => {
  const t = useTranslations();

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-dragging={isDragging || undefined}
      data-files={hasFiles || undefined}
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
          onClick={onFileSelect}
          disabled={isUploading}
        >
          <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
          {t('Common.selectFiles')}
        </Button>
      </div>
      {hasPendingDeletes && (
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="group absolute top-2 right-2 cursor-pointer gap-0"
          onClick={onResetPendingDeletes}
        >
          <RotateCcw aria-hidden="true" />
          <span className="animate-in max-w-0 overflow-hidden transition-all duration-300 group-hover:ml-1 group-hover:max-w-28">
            {t('Common.reset')}
          </span>
        </Button>
      )}
    </div>
  );
};
