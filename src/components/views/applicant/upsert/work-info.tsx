'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  TWorkArraySchema,
  WorkArraySchema,
} from '@/server/common/dto/work.dto';

interface IApplicantWorkInfoProps {
  id?: string;
}

const ApplicantWorkInfo: React.FC<IApplicantWorkInfoProps> = ({ id }) => {
  const t = useTranslations();

  const form = useForm<TWorkArraySchema>({
    resolver: zodResolver(WorkArraySchema),
    defaultValues: {
      workExperiences: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'workExperiences',
  });

  const onSubmit = (data: TWorkArraySchema) => {
    console.log(data);
    // TODO: Handle submit when hooks are ready
  };

  const addNewWorkExperience = () => {
    append({
      jobTitle: '',
      company: '',
      startDate: new Date(),
      endDate: null,
      responsibilities: '',
      achievements: '',
      location: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-header text-xl">
                {t('applicant.form.sections.workInfo.title')}
              </h2>
              <p className="font-body-2 text-muted-foreground">
                {t('applicant.form.sections.workInfo.description')}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="self-center md:ml-auto"
              onClick={addNewWorkExperience}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('applicant.form.buttons.addWork')}
            </Button>
          </div>

          <div className="mt-12 space-y-12">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border-b lg:rounded-md lg:border lg:p-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-8 right-3 lg:-top-9 lg:right-5"
                  onClick={() => remove(index)}
                >
                  {t('Common.delete')}
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormFields
                    name={`workExperiences.${index}.jobTitle`}
                    label={t('applicant.form.fields.jobTitle.label')}
                    required
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        placeholder={t(
                          'applicant.form.fields.jobTitle.placeholder',
                        )}
                        {...field}
                      />
                    )}
                  />
                  <FormFields
                    name={`workExperiences.${index}.company`}
                    label={t('applicant.form.fields.company.label')}
                    required
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        placeholder={t(
                          'applicant.form.fields.company.placeholder',
                        )}
                        {...field}
                      />
                    )}
                  />
                  <FormFields
                    name={`workExperiences.${index}.startDate`}
                    label={t('applicant.form.fields.startDate.label')}
                    required
                    control={form.control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                  <FormFields
                    name={`workExperiences.${index}.endDate`}
                    label={t('applicant.form.fields.endDate.label')}
                    control={form.control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                  <FormFields
                    name={`workExperiences.${index}.location`}
                    label={t('applicant.form.fields.location.label')}
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        placeholder={t(
                          'applicant.form.fields.location.placeholder',
                        )}
                        {...field}
                      />
                    )}
                  />
                  <div className="col-span-2">
                    <FormFields
                      name={`workExperiences.${index}.responsibilities`}
                      label={t('applicant.form.fields.responsibilities.label')}
                      required
                      control={form.control}
                      render={({ field }) => (
                        <Textarea
                          maxLength={500}
                          rows={10}
                          placeholder={t(
                            'applicant.form.fields.responsibilities.placeholder',
                          )}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormFields
                      name={`workExperiences.${index}.achievements`}
                      label={t('applicant.form.fields.achievements.label')}
                      control={form.control}
                      render={({ field }) => (
                        <Textarea
                          maxLength={500}
                          rows={10}
                          placeholder={t(
                            'applicant.form.fields.achievements.placeholder',
                          )}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-8">
                <div className="text-center">
                  <h3 className="font-header mt-2 text-sm">
                    {t('applicant.form.sections.workInfo.empty.title')}
                  </h3>
                  <p className="font-body-2 text-muted-foreground mt-1">
                    {t('applicant.form.sections.workInfo.empty.description')}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={addNewWorkExperience}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('applicant.form.buttons.addWork')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            {t('Common.cancel')}
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty}>
            {t('Common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicantWorkInfo;
