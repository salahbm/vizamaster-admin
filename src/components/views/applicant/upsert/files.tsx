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
import { useDeleteFile } from '@/hooks/files';

interface IApplicantFilesProps {
  id: string;
}

const uploadFormSchema = z.object({
  fileType: z.enum(Object.values(FileType) as [string, ...string[]]),
  files: z.array(z.any()).optional(), // Optional for syncing files
  pendingDeletes: z.array(z.string()).optional(), // Store pending deletes
});

type TUploadForm = z.infer<typeof uploadFormSchema>;

const ApplicantFiles: React.FC<IApplicantFilesProps> = ({ id }) => {
  const t = useTranslations();
  const { data: files, isLoading } = useApplicantFiles(id);
  const { mutateAsync: deleteFile } = useDeleteFile();

  const form = useForm<TUploadForm>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      fileType: FileType.OTHER,
      files: [],
      pendingDeletes: [],
    },
  });

  const selectedType = form.watch('fileType');

  const onSubmit = async (data: TUploadForm) => {
    const { pendingDeletes } = data;
    if (pendingDeletes?.length) {
      await Promise.all(
        pendingDeletes.map((fileKey) =>
          deleteFile({ fileKey, applicantId: id }),
        ),
      ).then(() => {
        form.setValue('pendingDeletes', [], { shouldValidate: true });
        form.setValue('files', [], { shouldValidate: true });
      });
    }
  };

  if (!id || isLoading) return <Loader />;

  const handleCancelDelete = () => {
    form.setValue('pendingDeletes', [], { shouldValidate: true });
    form.setValue('files', files, { shouldValidate: true });
  };

  const handleDelete = (fileKeys: string[]) => {
    form.setValue('pendingDeletes', fileKeys, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="fileType"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  className="flex items-center gap-6"
                  defaultValue={FileType.OTHER}
                  onValueChange={field.onChange}
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
            maxFiles={5}
            values={files}
            maxSizeMB={10}
            applicantId={id}
            fileType={selectedType}
            onDelete={handleDelete}
            onCancelDelete={() => handleCancelDelete()}
          />

          <p className="font-caption-1 text-muted-foreground text-end">
            <Info className="mr-2 inline-block size-4 text-inherit" />
            {t('Common.messages.uploadsSavedDeletesManual')}
          </p>
          <div className="mt-2 flex justify-end gap-2 border-t pt-4">
            <Button
              type="reset"
              variant="outline"
              disabled={
                form.formState.isSubmitting ||
                !form.watch('pendingDeletes')?.length
              }
              onClick={handleCancelDelete}
            >
              {t('Common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                !form.watch('pendingDeletes')?.length
              }
            >
              {t('Common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantFiles;
