'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormFields } from '@/components/shared/form-fields';
import { Uploader } from '@/components/shared/uploader';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { FileType } from '@/generated/prisma';
import { useDeleteFile } from '@/hooks/files';
import { TFileDto } from '@/server/common/dto/files.dto';

interface IApplicantFilesProps {
  id: string;
  files: TFileDto[] | [] | undefined;
  isLoading: boolean;
}

const uploadFormSchema = z.object({
  fileType: z.enum(Object.values(FileType) as [string, ...string[]]),
  files: z.array(z.any()).optional(), // Optional for syncing files
  pendingDeletes: z.array(z.string()).optional(), // Store pending deletes
});

type TUploadForm = z.infer<typeof uploadFormSchema>;

const ApplicantFiles: React.FC<IApplicantFilesProps> = ({
  id,
  files,
  isLoading,
}) => {
  const t = useTranslations();
  const { mutateAsync: deleteFile } = useDeleteFile();

  const form = useForm<TUploadForm>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      fileType: FileType.OTHER,
      files: files || [],
      pendingDeletes: [],
    },
  });

  useEffect(() => {
    if (!isLoading) {
      form.reset({
        files: files || [],
        pendingDeletes: [],
        fileType: FileType.OTHER,
      });
    }
  }, [files, isLoading, form]);

  const getPendingDeletes = (fileKeys: string[]) => {
    form.setValue('pendingDeletes', fileKeys, { shouldValidate: true });
  };

  const selectedType = form.watch('fileType');
  const isDisabled =
    form.formState.isSubmitting ||
    !form.formState.isDirty ||
    !form.getValues('pendingDeletes')?.length;

  const onSubmit = async (data: TUploadForm) => {
    const { pendingDeletes } = data;
    if (pendingDeletes?.length) {
      await Promise.all(
        pendingDeletes.map((fileKey) =>
          deleteFile({ fileKey, applicantId: id }),
        ),
      ).then(() => {
        form.setValue('pendingDeletes', [], { shouldValidate: true });
        form.reset();
      });
    }
  };

  if (!id || isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormFields
            name="fileType"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex w-full flex-wrap items-center gap-6"
                defaultValue={FileType.OTHER}
                onValueChange={field.onChange}
              >
                {Object.values(FileType).map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>
                      {t(`Common.fileType.${option}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />

          <FormFields
            name="files"
            control={form.control}
            render={({ field }) => (
              <Uploader
                maxFiles={5}
                maxSizeMB={10}
                applicantId={id}
                fileType={selectedType as FileType}
                getPendingDeletes={getPendingDeletes}
                {...field}
              />
            )}
          />

          <p className="font-caption-1 text-muted-foreground text-end">
            <Info className="mr-2 inline-block size-4 text-inherit" />
            {t('Common.messages.uploadsSavedDeletesManual')}
          </p>
          <div className="mt-2 flex justify-end border-t pt-4">
            <Button
              type="submit"
              variant="destructive"
              className="w-36"
              disabled={isDisabled}
            >
              {t('Common.delete')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantFiles;
