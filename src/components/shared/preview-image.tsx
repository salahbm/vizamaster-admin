'use client';

import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { FileType } from '@/generated/prisma';
import { usePreviewUrl } from '@/hooks/files/use-preview';

interface PreviewImageProps extends React.HTMLAttributes<HTMLImageElement> {
  fileKey: string;
  applicantId: string;
  fileType: FileType;
}

export const PreviewImage = ({
  fileKey,
  applicantId,
  fileType,
  className,
  ...props
}: PreviewImageProps) => {
  const { data, isLoading } = usePreviewUrl({
    fileKey,
    applicantId,
    fileType,
  });

  if (isLoading)
    return (
      <Skeleton
        className={cn(
          'bg-muted h-[200px] w-[200px] rounded border object-contain',
          className,
        )}
      />
    );

  return (
    <Image
      src={data?.signedUrl || fileKey}
      alt={fileKey}
      className={cn('object-contain', className)}
      width={200}
      height={200}
      unoptimized
      {...props}
    />
  );
};
