'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input, TelephoneInput } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Uploader } from '@/components/ui/uploader';

import { FileMetadataSchema } from '@/hooks/common/use-file-upload';

const applicantSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, { message: 'required' }),
  lastName: z.string().min(1, { message: 'required' }),
  middleName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date().optional(),
  passportNumber: z.string().min(1, { message: 'required' }),
  passportPhoto: z.array(FileMetadataSchema).optional(),

  // Contact Information
  email: z.email({ message: 'invalid_email' }),
  phoneNumber: z.string().min(1, { message: 'required' }),
  phoneNumberAdditional: z.string().optional(),

  // Address Information
  countryOfResidence: z.string().min(1, { message: 'required' }),
  addressLine1: z.string().min(1, { message: 'required' }),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // Employment & Nationality
  countryOfEmployment: z.string().min(1, { message: 'required' }),
  nationality: z.string().optional(),
  preferredJobTitle: z.string().optional(),
});

interface IUpsertApplicantProps {}

const UpsertApplicant: React.FC<IUpsertApplicantProps> = () => {
  const t = useTranslations('applicant.form');

  const form = useForm<z.infer<typeof applicantSchema>>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      dateOfBirth: undefined,
      passportNumber: '',
      passportPhoto: [],
      email: '',
      phoneNumber: '',
      phoneNumberAdditional: '',
      countryOfResidence: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      countryOfEmployment: '',
      nationality: '',
      preferredJobTitle: '',
    },
  });

  const onSubmit = (data: z.infer<typeof applicantSchema>) => {
    console.info(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Separator />
        {/* Personal Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.personalInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.personalInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="firstName"
              label={t('fields.firstName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.firstName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="lastName"
              label={t('fields.lastName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.lastName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="middleName"
              label={t('fields.middleName.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.middleName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="gender"
              label={t('fields.gender.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('fields.gender.placeholder')}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                  {...field}
                />
              )}
            />
            <FormFields
              name="dateOfBirth"
              label={t('fields.dateOfBirth.label')}
              control={form.control}
              render={({ field }) => <DatePicker {...field} />}
            />
            <FormFields
              name="passportNumber"
              label={t('fields.passportNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.passportNumber.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-6">
            <FormFields
              name="passportPhoto"
              label={t('fields.passportPhoto.label')}
              control={form.control}
              render={({ field }) => <Uploader {...field} maxFiles={1} />}
              message={t('fields.passportPhoto.message')}
              messageClassName="text-muted-foreground text-xs"
            />
          </div>
        </div>
        <Separator />
        {/* Contact Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.contactInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.contactInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="email"
              label={t('fields.email.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.email.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="phoneNumber"
              label={t('fields.phoneNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t('fields.phoneNumber.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="phoneNumberAdditional"
              label={t('fields.phoneNumberAdditional.label')}
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t('fields.phoneNumberAdditional.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Address Information */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.addressInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.addressInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="countryOfResidence"
              label={t('fields.countryOfResidence.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('fields.countryOfResidence.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine1"
              label={t('fields.addressLine1.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.addressLine1.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine2"
              label={t('fields.addressLine2.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.addressLine2.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="city"
              label={t('fields.city.label')}
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.city.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="state"
              label={t('fields.state.label')}
              control={form.control}
              render={({ field }) => (
                <Input placeholder={t('fields.state.placeholder')} {...field} />
              )}
            />
            <FormFields
              name="zipCode"
              label={t('fields.zipCode.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.zipCode.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Employment & Nationality */}
        <div>
          <h2 className="font-header text-xl">
            {t('sections.employmentInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('sections.employmentInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="countryOfEmployment"
              label={t('fields.countryOfEmployment.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('fields.countryOfEmployment.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="nationality"
              label={t('fields.nationality.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('fields.nationality.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="preferredJobTitle"
              label={t('fields.preferredJobTitle.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('fields.preferredJobTitle.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            {t('buttons.cancel')}
          </Button>
          <Button type="submit">{t('buttons.submit')}</Button>
        </div>
      </form>
    </Form>
  );
};

export default UpsertApplicant;
