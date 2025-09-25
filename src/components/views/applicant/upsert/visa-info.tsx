'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { FormSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

import { Visa } from '@/generated/prisma';
import { useUpdateApplicantVisa } from '@/hooks/applicant/use-applicant-visa';
import { TVisaDto, VisaDto } from '@/server/common/dto/visa.dto';

import { applicantVisaMapper } from './applicant.helpers';

interface IApplicantVisaInfoProps {
  id?: string;
  visa?: Visa[];
  isLoading?: boolean;
}

const ApplicantVisaInfo: React.FC<IApplicantVisaInfoProps> = ({
  id,
  visa,
  isLoading,
}) => {
  const t = useTranslations();

  const form = useForm({
    resolver: zodResolver(VisaDto),
    defaultValues: {
      issued: false,
      issueDate: null,
      departureDate: null,
      arrived: false,
      status: 'NOT_APPLIED',
      arrivalDate: null,
      returnedDate: null,
    },
  });

  const { mutate: updateVisa, isPending } = useUpdateApplicantVisa(id!);

  useEffect(() => {
    if (visa?.[0] && !isLoading) form.reset(applicantVisaMapper(visa[0]));
  }, [visa, isLoading, form]);

  if (isLoading || !id) return <FormSkeleton />;

  const onSubmit = (data: TVisaDto) => updateVisa(data);

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
              label={
                <>
                  <span className="font-body-1">
                    {t('applicant.form.fields.issued.label')}
                  </span>
                  <span className="text-muted-foreground font-caption-2">
                    {t('applicant.form.fields.issued.message')}
                  </span>
                </>
              }
              control={form.control}
              labelClassName="flex flex-col justify-start items-start gap-1"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(value) => {
                    field.onChange(value === 'true');
                    if (value === 'false') form.setValue('issueDate', null);
                    if (value === 'false') form.setValue('departureDate', null);
                  }}
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
              label={
                <>
                  <span className="font-body-1">
                    {t('applicant.form.fields.arrived.label')}
                  </span>
                  <span className="text-muted-foreground font-caption-2">
                    {t('applicant.form.fields.arrived.message')}
                  </span>
                </>
              }
              control={form.control}
              labelClassName="flex flex-col justify-start items-start gap-1"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(value) => {
                    field.onChange(value === 'true');
                    if (value === 'false') form.setValue('arrivalDate', null);
                  }}
                  className="flex items-center gap-4"
                >
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

            {/* Arrival Date */}
            {String(form.watch('arrived')) === 'true' && (
              <FormFields
                name="arrivalDate"
                label={t('applicant.form.fields.arrivalDate.label')}
                control={form.control}
                required
                className="lg:w-1/2"
                render={({ field }) => <DatePicker {...field} />}
              />
            )}

            <FormFields
              name="status"
              label={
                <>
                  <span className="font-body-1">
                    {t('applicant.form.fields.status.label')}
                  </span>
                  <span className="text-muted-foreground font-caption-2">
                    {t('applicant.form.fields.status.message')}
                  </span>
                </>
              }
              control={form.control}
              labelClassName="flex flex-col justify-start items-start gap-1"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value !== 'RETURNED')
                      form.setValue('returnedDate', null);
                  }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="NOT_APPLIED"
                      id="status-not-applied"
                    />
                    <Label htmlFor="status-not-applied">
                      {t('applicant.form.fields.status.options.not_applied')}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="DEPARTED" id="status-departed" />
                    <Label htmlFor="status-departed">
                      {t('applicant.form.fields.status.options.departed')}
                    </Label>
                  </div>
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
                </RadioGroup>
              )}
            />

            {/* Return Date */}
            {form.watch('status') === 'RETURNED' && (
              <FormFields
                name="returnedDate"
                label={t('applicant.form.fields.returnedDate.label')}
                control={form.control}
                required
                className="lg:w-1/2"
                render={({ field }) => <DatePicker {...field} />}
              />
            )}
          </div>
        </div>

        <Separator />

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            disabled={!form.formState.isDirty || isPending}
            onClick={() => form.reset()}
          >
            {t('Common.cancel')}
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {t('Common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicantVisaInfo;
