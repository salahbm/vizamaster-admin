'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Uploader } from '@/components/shared/uploader';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { FileType } from '@/generated/prisma';
import { TFileDto } from '@/server/common/dto/files.dto';

interface IApplicantFilesProps {
  id: string;
  files: TFileDto[] | [] | undefined;
  isLoading: boolean;
}

const ApplicantFiles: React.FC<IApplicantFilesProps> = ({
  id,
  files,
  isLoading,
}) => {
  const t = useTranslations();

  const [fileType, setFileType] = useState<FileType>(FileType.OTHER);

  if (!id || isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <RadioGroup
        className="flex w-full flex-wrap items-center gap-6"
        defaultValue={FileType.OTHER}
        onChange={(value) => setFileType(value as FileType)}
      >
        {Object.values(FileType).map((option) => (
          <div
            key={option}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{t(`Common.fileType.${option}`)}</Label>
          </div>
        ))}
      </RadioGroup>

      <Uploader
        maxFiles={5}
        maxSizeMB={10}
        applicantId={id}
        fileType={fileType}
        value={files}
      />
    </div>
  );
};

export default ApplicantFiles;
