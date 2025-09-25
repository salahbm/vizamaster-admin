'use client';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-pickers';
import { FormFields } from '@/components/shared/form-fields';
import { FormSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input, TelephoneInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

import { mapOptions } from '@/lib/utils';

import { getCountries, getLanguages } from '@/utils/intl';

import { Applicant } from '@/generated/prisma';
import { useCreateApplicant, useUpdateApplicant } from '@/hooks/applicant';
import { useCodes } from '@/hooks/settings/codes';
import { ApplicantDto, TApplicantDto } from '@/server/common/dto/applicant.dto';

import { applicantDefaults, applicantQueries } from './applicant.helpers';

interface IApplicantUserInfoProps {
  id?: string;
  applicant?: Applicant;
  countryOfEmployment: string;
  partner: string;
  isLoading?: boolean;
}

const ApplicantUserInfo: React.FC<IApplicantUserInfoProps> = ({
  id,
  applicant,
  countryOfEmployment,
  partner,
  isLoading,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  // QUERIES
  const { data: countries, isLoading: isLoadingCountries } = useCodes(
    applicantQueries('group-countries'),
  );
  const { data: partners, isLoading: isLoadingPartners } = useCodes(
    applicantQueries('group-partners'),
  );
  const { data: vacancies, isLoading: isLoadingVacancies } = useCodes(
    applicantQueries('group-vacancies'),
  );

  // MUTATIONS
  const { mutateAsync: createApplicant, isPending: isPendingCreateApplicant } =
    useCreateApplicant();
  const { mutateAsync: updateApplicant, isPending: isPendingUpdateApplicant } =
    useUpdateApplicant();

  // MEMOS
  const countryOfResidenceOptions = useMemo(() => getCountries(), []);
  const languagesOptions = useMemo(() => getLanguages(), []);
  const { memoCountries, memoPartners, memoVacancies } = useMemo(() => {
    return {
      memoCountries: mapOptions(countries?.data, locale),
      memoPartners: mapOptions(partners?.data, locale),
      memoVacancies: mapOptions(vacancies?.data, locale),
    };
  }, [countries, partners, vacancies, locale]);

  const form = useForm<TApplicantDto>({
    resolver: zodResolver(ApplicantDto),
    defaultValues: applicantDefaults(countryOfEmployment, partner),
  });

  useEffect(() => {
    if (applicant)
      form.reset({
        ...applicant,
        dateOfBirth: applicant.dateOfBirth
          ? new Date(applicant.dateOfBirth)
          : undefined,
      });
  }, [applicant, form]);

  if (isLoading || isPendingUpdateApplicant) return <FormSkeleton />;

  const onSubmit = (data: TApplicantDto) => {
    if (id) {
      updateApplicant({ ...data, id });
    } else {
      createApplicant(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!id && <Separator />}
        {/* Personal Information */}
        <div>
          <h2 className="font-header">
            {t('applicant.form.sections.personalInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('applicant.form.sections.personalInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="firstName"
              label={t('applicant.form.fields.firstName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.firstName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="lastName"
              label={t('applicant.form.fields.lastName.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.lastName.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="middleName"
              label={t('applicant.form.fields.middleName.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t(
                    'applicant.form.fields.middleName.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="gender"
              label={t('applicant.form.fields.gender.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('applicant.form.fields.gender.placeholder')}
                  options={[
                    {
                      value: 'MALE',
                      label: t('applicant.form.fields.gender.options.male'),
                    },
                    {
                      value: 'FEMALE',
                      label: t('applicant.form.fields.gender.options.female'),
                    },
                  ]}
                  {...field}
                />
              )}
            />
            <FormFields
              name="dateOfBirth"
              label={t('applicant.form.fields.dateOfBirth.label')}
              control={form.control}
              render={({ field }) => <DatePicker {...field} />}
            />
            <FormFields
              name="passportNumber"
              label={t('applicant.form.fields.passportNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t(
                    'applicant.form.fields.passportNumber.placeholder',
                  )}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Contact Information */}
        <div>
          <h2 className="font-header">
            {t('applicant.form.sections.contactInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('applicant.form.sections.contactInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormFields
              name="email"
              label={t('applicant.form.fields.email.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.email.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="phoneNumber"
              label={t('applicant.form.fields.phoneNumber.label')}
              required
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t(
                    'applicant.form.fields.phoneNumber.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="phoneNumberAdditional"
              label={t('applicant.form.fields.phoneNumberAdditional.label')}
              control={form.control}
              render={({ field }) => (
                <TelephoneInput
                  placeholder={t(
                    'applicant.form.fields.phoneNumberAdditional.placeholder',
                  )}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Address Information */}
        <div>
          <h2 className="font-header">
            {t('applicant.form.sections.addressInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('applicant.form.sections.addressInfo.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="countryOfResidence"
              label={t('applicant.form.fields.countryOfResidence.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={countryOfResidenceOptions}
                  placeholder={t(
                    'applicant.form.fields.countryOfResidence.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine1"
              label={t('applicant.form.fields.addressLine1.label')}
              required
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t(
                    'applicant.form.fields.addressLine1.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="addressLine2"
              label={t('applicant.form.fields.addressLine2.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t(
                    'applicant.form.fields.addressLine2.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="city"
              label={t('applicant.form.fields.city.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.city.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="state"
              label={t('applicant.form.fields.state.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.state.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="zipCode"
              label={t('applicant.form.fields.zipCode.label')}
              control={form.control}
              render={({ field }) => (
                <Input
                  placeholder={t('applicant.form.fields.zipCode.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Employment & Nationality */}
        <div>
          <h2 className="font-header">
            {t('applicant.form.sections.employmentInfo.title')}
          </h2>
          <p className="font-body-2 text-muted-foreground mb-6">
            {t('applicant.form.sections.employmentInfo.description')}
          </p>
          {id && (
            <FormFields
              name="status"
              control={form.control}
              label={t('Common.status')}
              className="my-6"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  defaultValue="all"
                  className="font-body-2 flex flex-wrap items-center justify-start gap-4"
                >
                  {[
                    { value: 'NEW', label: t('Common.statuses.new') },
                    {
                      value: 'IN_PROGRESS',
                      label: t('Common.statuses.inProgress'),
                    },
                    {
                      value: 'CONFIRMED_PROGRAM',
                      label: t('Common.statuses.confirmedProgram'),
                    },
                    { value: 'HIRED', label: t('Common.statuses.hired') },
                    {
                      value: 'HOTEL_REJECTED',
                      label: t('Common.statuses.hotelRejected'),
                    },
                    { value: 'FIRED', label: t('Common.statuses.fired') },
                    {
                      value: 'APPLICANT_REJECTED',
                      label: t('Common.statuses.applicantRejected'),
                    },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem id={option.value} value={option.value} />
                      <Label className="font-body-2" htmlFor={option.value}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFields
              name="countryOfEmployment"
              label={t('applicant.form.fields.countryOfEmployment.label')}
              required
              control={form.control}
              loading={isLoadingCountries}
              render={({ field }) => (
                <Combobox
                  searchable
                  disabled={!id && countryOfEmployment !== 'all'}
                  options={memoCountries}
                  placeholder={t(
                    'applicant.form.fields.countryOfEmployment.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="partner"
              label={t('applicant.form.fields.partner.label')}
              required
              control={form.control}
              loading={isLoadingPartners}
              render={({ field }) => (
                <Combobox
                  searchable
                  disabled={!id && partner !== 'all'}
                  options={memoPartners}
                  placeholder={t('applicant.form.fields.partner.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="nationality"
              label={t('applicant.form.fields.nationality.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={countryOfResidenceOptions}
                  placeholder={t(
                    'applicant.form.fields.nationality.placeholder',
                  )}
                  {...field}
                />
              )}
            />
            <FormFields
              name="preferredJobTitle"
              label={t('applicant.form.fields.jobTitle.label')}
              control={form.control}
              loading={isLoadingVacancies}
              render={({ field }) => (
                <Combobox
                  searchable
                  options={memoVacancies}
                  placeholder={t('applicant.form.fields.jobTitle.placeholder')}
                  {...field}
                />
              )}
            />
            <FormFields
              name="languages"
              label={t('applicant.form.fields.languages.label')}
              control={form.control}
              render={({ field }) => (
                <Combobox
                  multiple
                  searchable
                  options={languagesOptions}
                  placeholder={t('applicant.form.fields.languages.placeholder')}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <Separator />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            {t('Common.cancel')}
          </Button>
          <Button
            type="submit"
            className="w-36"
            disabled={isPendingCreateApplicant || !form.formState.isDirty}
          >
            {t('applicant.form.buttons.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicantUserInfo;
