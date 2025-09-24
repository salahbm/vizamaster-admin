'use client';

import Image from 'next/image';

import { AlertCircleIcon, Download, FileText, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { formatBytes } from '@/utils/formats';
import { downloadFile } from '@/utils/helpers';

import { ExtendedFileDto } from '@/hooks/common/use-file-upload';
import { usePreviewUrl } from '@/hooks/files/use-preview';

import { PreviewFileSkeleton } from '../skeletons/preview-file';
import { Button } from './button';

interface PreviewFileProps extends React.HTMLAttributes<HTMLImageElement> {
  fileKey: string;
  file: ExtendedFileDto; // Updated to ExtendedFileDto for status/error
  onDelete?: (e: React.MouseEvent) => Promise<void>; // Updated to async for removeFile
  status?: ExtendedFileDto['status']; // Passed from parent, but can access from file
  error?: string; // Per-file error
}

export const PreviewFile = ({
  fileKey,
  className,
  file,
  onDelete,
  status = file.status, // Use file.status if not passed
  error = file.error,
  ...props
}: PreviewFileProps) => {
  const { data, isLoading: isLoadingPreview } = usePreviewUrl(fileKey);

  const isLoading =
    isLoadingPreview || status === 'uploading' || status === 'pending';
  const hasError = !!error || status === 'error';
  const signedUrl = data?.signedUrl;
  const previewUrl = file.preview || signedUrl; // Prefer local preview if available
  const canDownload = !!previewUrl;
  const canDelete = !isLoading && !hasError;

  if (isLoading)
    return (
      <PreviewFileSkeleton className={className} previewUrl={previewUrl} />
    );

  if (!previewUrl && !file.mimeType) return null; // No preview available

  return (
    <div
      key={file.id}
      className="bg-background animate-fade-in flex shrink items-center justify-between gap-2 rounded-lg border p-2 pe-3"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {file.mimeType?.includes('image') && previewUrl ? (
          <div className="bg-accent relative aspect-square shrink-0 rounded">
            <Image
              src={previewUrl}
              alt={file.fileName}
              className={cn(
                'size-10 rounded-[inherit] object-cover',
                className,
              )}
              width={200}
              height={200}
              unoptimized
              {...props}
            />
          </div>
        ) : (
          <FileText className="text-accent-foreground size-6 rounded-[inherit] object-cover" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-caption-1 truncate text-[13px]">{file.fileName}</p>
          <p className="text-muted-foreground text-xs">
            {formatBytes(file.fileSize || 0)}
          </p>
          {hasError && (
            <div className="text-destructive flex items-center gap-1 text-xs">
              <AlertCircleIcon className="size-3" />
              <span>{error || 'Error uploading file'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          type="button"
          className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            canDownload && downloadFile(previewUrl!, file.fileName);
          }}
          aria-label="Download file"
          disabled={!canDownload || isLoading}
        >
          <Download aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          className="text-muted-foreground/80 hover:text-destructive -me-2 size-8 hover:bg-transparent"
          onClick={onDelete}
          aria-label="Remove file"
          disabled={!canDelete}
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
