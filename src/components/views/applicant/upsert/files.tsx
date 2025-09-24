'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Uploader } from '@/components/ui/uploader';

import { FileType } from '@/generated/prisma';
import { useApplicantFiles } from '@/hooks/applicant/use-applicant-files';

interface IApplicantFilesProps {
  id: string;
}

const uploadFormSchema = z.object({
  fileType: z.enum(Object.values(FileType)),
});

type TUploadForm = z.infer<typeof uploadFormSchema>;

const ApplicantFiles: React.FC<IApplicantFilesProps> = ({ id }) => {
  const t = useTranslations();
  const { data: files, refetch, isLoading } = useApplicantFiles(id);

  const form = useForm<TUploadForm>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      fileType: FileType.OTHER,
    },
  });

  const selectedType = form.watch('fileType');

  if (!id || isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="fileType"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  className="flex items-center gap-6"
                  defaultValue={FileType.OTHER}
                >
                  {Object.values(FileType).map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>
                        {t(`Common.fileType.${option}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <Uploader
            values={files}
            maxFiles={5}
            maxSizeMB={10}
            applicantId={id}
            fileType={selectedType}
            onChange={() => refetch()}
          />
          <p className="font-caption-1 text-muted-foreground text-end">
            <Info className="mr-2 inline-block size-4 text-inherit" />
            Uploads are saved automatically, but deleting files requires a
            manual action.
          </p>
          <div className="mt-2 flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              {t('Common.cancel')}
            </Button>
            <Button type="submit" disabled={true}>
              {t('Common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantFiles;
