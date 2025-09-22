'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Uploader } from '@/components/ui/uploader';

import { VisaDto } from '@/server/common/dto/visa.dto';

interface IApplicantVisaInfoProps {
  id?: string;
}

const ApplicantVisaInfo: React.FC<IApplicantVisaInfoProps> = ({ id }) => {
  const t = useTranslations();

  const form = useForm({
    resolver: zodResolver(VisaDto),
    defaultValues: {
      issued: false,
      issueDate: null,
      departureDate: null,
      arrived: false,
      status: 'STILL_WORKING',
      flightDocuments: null,
      files: null,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data, id);
    // TODO: Handle submit when hooks are ready
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="font-header text-xl">
            {t('applicant.form.sections.visaInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('applicant.form.sections.visaInfo.description')}
          </p>

          <div className="flex flex-col gap-6">
            <FormFields
              name="issued"
              label={t('applicant.form.fields.issued.label')}
              control={form.control}
              message={t('applicant.form.fields.issued.message')}
              messageClassName="text-muted-foreground text-xs mt-2"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  defaultValue="false"
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="true" id="issued-yes" />
                    <Label htmlFor="issued-yes">
                      {t('applicant.form.fields.issued.options.yes')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="false" id="issued-no" />
                    <Label htmlFor="issued-no">
                      {t('applicant.form.fields.issued.options.no')}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {String(form.watch('issued')) === 'true' ? (
              <div className="flex flex-col gap-6 md:flex-row">
                <FormFields
                  name="issueDate"
                  className="w-full"
                  label={t('applicant.form.fields.issueDate.label')}
                  control={form.control}
                  required
                  render={({ field }) => <DatePicker {...field} />}
                />

                <FormFields
                  name="departureDate"
                  className="w-full"
                  label={t('applicant.form.fields.departureDate.label')}
                  control={form.control}
                  required
                  render={({ field }) => <DatePicker {...field} />}
                />
              </div>
            ) : null}

            <FormFields
              name="arrived"
              label={t('applicant.form.fields.arrived.label')}
              control={form.control}
              message={t('applicant.form.fields.arrived.message')}
              messageClassName="text-muted-foreground text-xs mt-2"
              render={({ field }) => (
                <RadioGroup {...field} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="true" id="arrived-yes" />
                    <Label htmlFor="arrived-yes">
                      {t('applicant.form.fields.arrived.options.yes')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="false" id="arrived-no" />
                    <Label htmlFor="arrived-no">
                      {t('applicant.form.fields.arrived.options.no')}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            <FormFields
              name="status"
              label={t('applicant.form.fields.status.label')}
              control={form.control}
              message={t('applicant.form.fields.status.message')}
              messageClassName="text-muted-foreground text-xs mt-2"
              required
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  className="flex flex-wrap items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="STILL_WORKING"
                      id="status-still-working"
                    />
                    <Label htmlFor="status-still-working">
                      {t('applicant.form.fields.status.options.still_working')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="RETURNED" id="status-returned" />
                    <Label htmlFor="status-returned">
                      {t('applicant.form.fields.status.options.returned')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="DEPARTED" id="status-departed" />
                    <Label htmlFor="status-departed">
                      {t('applicant.form.fields.status.options.departed')}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="mt-6 space-y-6">
            <FormFields
              name="flightDocuments"
              label={t('applicant.form.fields.flightDocuments.label')}
              control={form.control}
              render={({ field }) => <Uploader {...field} maxFiles={5} />}
              message={t('applicant.form.fields.flightDocuments.message')}
              messageClassName="text-muted-foreground text-xs"
            />

            <FormFields
              name="files"
              label={t('applicant.form.fields.files.label')}
              control={form.control}
              render={({ field }) => <Uploader {...field} maxFiles={5} />}
              message={t('applicant.form.fields.files.message')}
              messageClassName="text-muted-foreground text-xs"
            />
          </div>
        </div>

        <Separator />

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

export default ApplicantVisaInfo;
